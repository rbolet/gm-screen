const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const multer = require('multer');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');
// const session = require('express-session');
const db = require('./_config');
const io = require('socket.io')(http);
const justNow = parseInt((Date.now() * 0.001).toFixed(0));

// make public folder files available, such as index.html
const staticPath = path.join(__dirname, 'public');
const staticMiddleware = express.static(staticPath);
app.use(staticMiddleware);
app.use(bodyParser.json());
// app.use(session({
//   secret: 'itsasecrettoeveryone',
//   resave: true,
//   saveUninitialized: true
// }));

function testForSQLInjection(input) {
  const regexPattern = new RegExp(/('(''|[^'])* ')|(\);)|(--)|(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|VERSION|ORDER|UNION( +ALL){0,1})/);
  return regexPattern.test(input);
}

app.post('/newUser', function (req, res, next) {
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
app.post('/auth', function (req, res, next) {
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

// GET list of active Campaigns
app.get('/activeGameSessions', (req, res, next) => {
  if (!activeGameSessions.length) {
    res.status(200).json(null);
  } else {
    res.status(200).json(activeGameSessions);
  }

});

// GET images from given session
app.post('/campaignAssets', (req, res, next) => {
  db.query(`SELECT * FROM images
              JOIN campaignImages ON images.imageID = campaignImages.imageID
              WHERE campaignImages.campaignID = ${req.body.campaignId}`)
    .then(([campaignAssets]) => {
      res.status(200).json(campaignAssets).end();
    })
    .catch(err => next(err));
});

// POST for GM to launch a session
const activeGameSessions = [];
app.post('/launchSession', (req, res, next) => {
  const gameSession = req.body.gameSession;
  const user = req.body.user;
  const sessionQuery = `SELECT * FROM sessions WHERE sessions.campaignID = ${gameSession.campaignId};`;
  db.query(sessionQuery)
    .then(([session]) => {
      if (session.length > 0) {

        return { session: session[0] };
      }
      return db
        .query(`INSERT INTO sessions(campaignID, updated) VALUES(${gameSession.campaignId}, ${justNow});`)
        .then(([insertRes]) => {
          return db
            .query(sessionQuery)
            .then(([session]) => {
              return { session: session[0] };
            });
        });
    })
    .then(results => {
      moveUsertoRoom(gameSession, user);
      results.session.tokens = results.session.tokens ? results.session.tokens : [];

      gameSession.session = {
        sessionId: results.session.sessionId,
        updated: results.session.updated,
        environmentImageFileName: results.session.environmentImageFileName,
        tokens: results.session.tokens
      };
      activeGameSessions.push(gameSession);
      res.json(results.session);
    })
    .catch(err => next(err));
});

// POST for player to join a session room
app.post('/joinSession', (req, res, next) => {
  moveUsertoRoom(req.body.sessionConfig, req.body.socketId);
  res.status(200).json({ message: `joined session "${req.body.sessionConfig.sessionName}"` });
});

app.post('/configUserSocket', (req, res, next) => {
  const user = req.body;
  configUserSocket(user);
  res.json({ message: `configuring ${user.userName}'s socket` });
});

app.post('/updateEnvironment', (req, res, next) => {
  const gameSession = req.body.gameSession;
  const reqSessionId = req.body.gameSession.session.sessionId;
  const fileName = req.body.newImage.fileName ? `"${req.body.newImage.fileName}"` : null;
  const query = `UPDATE sessions SET updated = ${justNow}, environmentImageFileName = ${fileName} WHERE sessionId = ${reqSessionId};`;
  db.query(query)
    .then(rowsAffected => {
      return buildSession(reqSessionId);
    })
    .then(session => {
      gameSession.session = session;
      pushNewSessionState(gameSession);
      // pushEnvironmenttoRoom(gameSession);
      res.json({ message: 'pushing new environment ...' });
    })
    .catch(err => next(err));
});

app.post('/addToken', (req, res, next) => {
  const gameSession = req.body.gameSession;
  const reqSessionId = req.body.gameSession.session.sessionId;
  db.query(`INSERT INTO tokens (sessionId, imageId) VALUES(${reqSessionId}, ${req.body.image.imageId})`)
    .then(insertRes => {
      return buildSession(reqSessionId);
    })
    .then(session => {
      gameSession.session = session;
      pushNewSessionState(gameSession);
      res.json({ message: 'pushing new token ...' });
    });

});

async function buildSession(sessionId) {
  let tokens = [];
  return new Promise(resolve => {
    db.query(`SELECT tokens.tokenId, tokens.imageId FROM tokens WHERE sessionId = ${sessionId}`)
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
        imageId: result[0].insertId,
        filename: req.file.filename,
        alias: req.body.alias,
        category: req.body.category
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

// Socket io set up and incoming event handling
const userSockets = {};
io.on('connection', socket => {
  userSockets[socket.id] = { socket };
  socket.emit('connected', socket.id);

  socket.on('disconnect', reason => {
    const disconnectingId = userSockets[socket.id].userId;
    for (const campaignIndex in activeGameSessions) {
      if (disconnectingId === activeGameSessions[campaignIndex].campaignGM) {
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
  userSocket.socket.emit();

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
