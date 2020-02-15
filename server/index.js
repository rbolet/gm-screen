const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const multer = require('multer');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');
const sessions = require('./sessions');
const db = require('./_config');
const io = require('socket.io')(http);
const fs = require('fs');
const justNow = parseInt((Date.now() * 0.001).toFixed(0));

const staticPath = path.join(__dirname, 'public');
app.use(sessions);
app.use(bodyParser.json());
app.use(express.static(staticPath));

function testForSQLInjection(input) {
  const regexPattern = new RegExp(/('(''|[^'])* ')|(\);)|(--)|(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|VERSION|ORDER|UNION( +ALL){0,1})/);
  return regexPattern.test(input);
}

app.get('/welcome', (req, res, next) => {
  if (!req.session.visits) {
    req.session.regenerate(err => {
      if (err) return next(err);
      req.session.visits = 1;
      res.json({ visits: req.session.visits });
    });
  } else {
    req.session.visits++;
    res.json({ visits: req.session.visits });
  }
});

app.post('/newUser', (req, res, next) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    res.status(401).json({ reason: 'incomplete' });
  } else if (testForSQLInjection(userName) || testForSQLInjection(password)) {
    res.status(401).json({ reason: 'injection' });
  } else {
    const passwordValidation = new RegExp(/^(?=.{6,20})(?!.*\s).*$/, 'gm');
    const userNameValidation = new RegExp(/^(?=\S)([a-z]|[A-Z]|[0-9]){4,40}$/, 'gm');

    if (!passwordValidation.test(password)) {
      res.status(401).json({ reason: 'invalidPassword' });
      return;
    } else if (!userNameValidation.test(userName)) {
      res.status(401).json({ reason: 'invalidUserName' });
      return;
    }
    const getusersQuery = 'SELECT userName FROM users';
    let exists = null;
    db.query(getusersQuery)
      .then(([users]) => {
        exists = users.find(existingUserName => { return existingUserName.userName.toString() === userName; });
        if (exists) {
          res.status(200).json({ reason: 'exists' });
        } else {
          const insertQuery = 'INSERT INTO users(userName, password) VALUES(?,?);';
          db.execute(insertQuery, [userName, password])
            .then(([rows]) => {
              res.status(200).json({ userId: rows.insertId });
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));

  }
});

// POST login
app.post('/auth', (req, res, next) => {
  const userName = req.body.userName;

  const password = req.body.password;
  if (testForSQLInjection(userName) || testForSQLInjection(password)) {
    res.status(401).json({ reason: 'injection' });
    return;
  }

  const query = `SELECT userId, userName FROM users WHERE userName = "${userName}" AND password = "${password}";`;
  db.query(query)
    .then(([rows]) => {
      if (!rows.length) {
        res.status(401).json({ reason: 'failed' });
      } else {
        res.status(200).json(rows);
      }
    })
    .catch(err => next(err));
});

// POST campaigns per GM
app.post('/gmCampaigns', (req, res, next) => {
  const query = `SELECT * FROM campaigns WHERE campaignGM = "${req.body.userId}";`;
  db.query(query)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch(err => next(err));
});

app.post('/newCampaign', (req, res, next) => {
  db.query(`INSERT INTO campaigns(campaignGM, campaignName) VALUES(${req.body.user.userId}, "${req.body.campaignName}");`)
    .then(insertRes => {
      return db.query(`SELECT * FROM campaigns WHERE campaignId = ${insertRes[0].insertId}`);
    })
    .then(([newCampaign]) => {
      res.json(newCampaign[0]);
    })
    .catch(err => next(err));
});

// GET list of active Campaigns
app.get('/activeGameSessions', (req, res, next) => {
  const activeCampaigns = [];
  if (activeGameSessions.length) {
    for (const gameSession of activeGameSessions) {
      const campaign = {
        campaignId: gameSession.campaignId,
        campaignName: gameSession.campaignName
      };
      activeCampaigns.push(campaign);
    }
  }
  res.status(200).json(activeCampaigns);

});

// POST images from given session
app.post('/campaignAssets', (req, res, next) => {
  db.query(`SELECT * FROM images
              JOIN campaignImages ON images.imageId = campaignImages.imageId
              WHERE campaignImages.campaignId = ${req.body.campaign.campaignId}`)
    .then(([campaignAssets]) => {
      res.status(200).json(campaignAssets).end();
    })
    .catch(err => next(err));
});

const activeGameSessions = [];
// POST for GM to launch a session
app.post('/launchSession', (req, res, next) => {
  const gameSession = req.body.gameSession;
  const user = req.body.user;
  db.query(`SELECT sessionId FROM sessions WHERE sessions.campaignId = ${gameSession.campaignId};`)
    .then(([sessionRes]) => {
      if (sessionRes.length > 0) {
        return sessionRes[0];
      } else {
        return db.query(`INSERT INTO sessions(campaignID, updated) VALUES(${gameSession.campaignId}, ${justNow});`)
          .then(insertRes => {
            return { sessionId: insertRes[0].insertId };
          });
      }
    })
    .then(result => {
      return buildSession(result.sessionId);
    })
    .then(session => {
      gameSession.session = session;
      moveUsertoRoom(gameSession, user);
      let alreadyActive = false;
      for (const activeSession of activeGameSessions) {
        if (activeSession.campaignId === gameSession.campaignId) alreadyActive = true;
      }
      if (!alreadyActive) activeGameSessions.push(gameSession);
      res.json(session);
    })
    .catch(err => next(err));
});

app.post('/configUserSocket', (req, res, next) => {
  const user = req.body;
  res.json({ message: `configuring ${user.userName}'s socket` });
  configUserSocket(user);

});

app.post('/updateEnvironment', (req, res, next) => {
  const gameSession = req.body.gameSession;
  const reqSessionId = req.body.gameSession.session.sessionId;
  const fileName = req.body.newImage.fileName ? `"${req.body.newImage.fileName}"` : null;
  const query = `UPDATE sessions SET updated = ${justNow}, environmentImageFileName = ${fileName} WHERE sessionId = ${reqSessionId};`;
  res.json({ message: 'pushing new environment ...' });
  db.query(query)
    .then(rowsAffected => {
      return buildSession(reqSessionId);
    })
    .then(session => {
      gameSession.session = session;
      pushNewSessionState(gameSession);
    })
    .catch(err => next(err));
});

app.post('/addToken', (req, res, next) => {
  const gameSession = req.body.gameSession;
  const reqSessionId = req.body.gameSession.session.sessionId;
  res.json({ message: 'pushing new token ...' });
  db.query(`INSERT INTO tokens (sessionId, imageFileName) VALUES(${reqSessionId}, "${req.body.image.fileName}")`)
    .then(insertRes => {
      return buildSession(reqSessionId);
    })
    .then(session => {
      gameSession.session = session;
      pushNewSessionState(gameSession);
    });
});

app.post('/removeToken', (req, res, next) => {
  const gameSession = req.body.gameSession;
  const reqSessionId = req.body.gameSession.session.sessionId;
  const token = req.body.token;
  res.json({ message: 'removing one token ...' });
  db.query(`DELETE FROM tokens WHERE tokenId = ${token.tokenId}`)
    .then(affectedRows => {
      return buildSession(reqSessionId);
    })
    .then(session => {
      gameSession.session = session;
      pushNewSessionState(gameSession);

    });
});

app.post('/clearAllTokens', (req, res, next) => {
  const gameSession = req.body.gameSession;
  const reqSessionId = req.body.gameSession.session.sessionId;
  res.json({ message: 'clearing all tokens ...' });
  db.query(`DELETE FROM tokens WHERE sessionId = ${reqSessionId}`)
    .then(affectedRows => {
      return buildSession(reqSessionId);
    })
    .then(session => {
      gameSession.session = session;
      pushNewSessionState(gameSession);
    });
});

app.post('/deleteCampaign', (req, res, next) => {
  let imageIdsString = null;
  db.query(`SELECT imageId FROM campaignImages WHERE campaignId = ${req.body.campaignId}`)
    .then(([rows]) => {
      if (rows.length > 0) {
        const imageIdArray = [];
        for (const result of rows) {
          imageIdArray.push(result.imageId);
        }
        imageIdsString = imageIdArray.join();
      }
      res.json({ message: `deleting ${req.body.campaignName} ...` });
      return db.query(`DELETE FROM campaigns WHERE campaignId = ${req.body.campaignId}`);
    })
    .then(rowsAffected => {
      if (imageIdsString) deleteImagesById(imageIdsString);
    });
});

// upload middleware config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/public/images'));
  },
  filename: (req, file, cb) => {
    const parsed = path.parse(file.originalname);
    cb(null, `${uuid()}.${parsed.ext}`);
  }
});
const upload = multer({ storage: storage });

// Upload POST
app.post('/upload', upload.single('image-upload'), (req, res, next) => {
  let responseObject = {};
  const insertImageSQL = `INSERT INTO
                            images (filename, alias, category)
                          VALUES ('${req.file.filename}',
                            '${req.body.alias}',
                            '${req.body.category}'
                            )`;
  db.query(insertImageSQL)
    .then(result => {
      responseObject = {
        image: {
          imageId: result[0].insertId,
          filename: req.file.filename,
          alias: req.body.alias,
          category: req.body.category
        },
        campaignId: req.body.campaignId
      };
      const insertCampaignImageSQL = `INSERT INTO
                                      campaignImages (campaignId, imageId)
                                    VALUES (${req.body.campaignId}, '${result[0].insertId}')`;
      db.query(insertCampaignImageSQL)
        .then(() => {
        })
        .catch(error => { next(error); });
    })
    .then(result => {

      res.status(200).json(responseObject);
    })
    .catch(error => { next(error); });
});

function deleteImagesById(imageIdsString) {
  db.query(`SELECT * FROM images WHERE imageId IN (${imageIdsString});`)
    .then(([rows]) => {
      for (const image of rows) {
        fs.unlink(path.join(staticPath, 'images', image.fileName), err => {
          if (err) throw err;
        });
      }
      return db.query(`DELETE FROM images WHERE imageId IN (${imageIdsString})`);
    })
    .then(rowsAffected => {
    })
    .catch(err => { throw err; });
}

function buildSession(sessionId) {
  let tokens = [];
  return new Promise(resolve => {
    db.query(`SELECT tokens.tokenId, tokens.imageFileName FROM tokens WHERE sessionId = ${sessionId}`)
      .then(([rows]) => {
        tokens = rows;
        return db.query(`SELECT * FROM sessions WHERE sessionId = ${sessionId}`);
      })
      .then(([result]) => {
        return {
          sessionId: result[0].sessionId,
          environmentImageFileName: result[0].environmentImageFileName,
          tokens
        };
      })
      .then(done => resolve(done));
  });
}

// Socket io set up and incoming event handling
const userSockets = {};
io.on('connection', socket => {
  userSockets[socket.id] = { socket };
  socket.emit('connected', socket.id);

  socket.on('disconnect', reason => {
    const disconnectingUser = userSockets[socket.id].user;
    for (const campaignIndex in activeGameSessions) {
      if (disconnectingUser.userId === activeGameSessions[campaignIndex].campaignGM) {
        const sessionRoom = nameSessionRoom(activeGameSessions[campaignIndex]);
        io.to(sessionRoom).emit('kick', `${disconnectingUser.userName} has ended the session`);
        activeGameSessions.splice(campaignIndex, 1);
      }
    }
    delete userSockets[socket.id];
  });

  socket.on('error', error => {
    console.error('Sockect.io error:', error);
  });
});

function configUserSocket(user) {
  const userSocket = userSockets[user.socketId];
  userSocket.user = user;

}

function moveUsertoRoom(gameSession, user) {

  const socket = userSockets[user.socketId].socket;
  const sessionRoom = nameSessionRoom(gameSession);
  socket.join(sessionRoom, () => {
    io.to(sessionRoom).emit('update', `${user.userName} has joined ${sessionRoom}`);
  });

}

function nameSessionRoom(gameSession) {
  return `${gameSession.campaignName} (${gameSession.campaignId})`;
}

function pushNewSessionState(gameSession) {
  const sessionRoom = nameSessionRoom(gameSession);
  io.to(sessionRoom).emit('updateSessionState', gameSession.session);
}

// Error Handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

http.listen(3001, () => {
  // eslint-disable-next-line
  console.log('listening on 3001 ...'); });
