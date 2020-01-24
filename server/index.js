const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const multer = require('multer');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./_config');
const io = require('socket.io')(http);

// make public folder files available, such as index.html
const staticPath = path.join(__dirname, 'public');
const staticMiddleware = express.static(staticPath);
app.use(staticMiddleware);
app.use(bodyParser.json());
app.use(session({
  secret: 'itsasecrettoeveryone',
  resave: true,
  saveUninitialized: true
}));

// POST login
app.post('/auth', function (req, res, next) {
  const userName = req.body.userName;
  const password = req.body.password;
  const query = `SELECT userId, userName FROM users WHERE userName = "${userName}" AND password = "${password}";`;
  db.query(query)
    .then(([rows]) => {
      if (!rows.length) {
        res.status(401).json({ message: 'Please provide a valid username and password' });
      } else {
        res.status(200).json(rows);
      }
    })
    .catch(err => next(err));
});

// POST sessions per GM
app.post('/gmSessions', (req, res, next) => {
  const query = `SELECT * FROM sessions WHERE sessionGM = "${req.body.userId}";`;
  db.query(query)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch(err => next(err));
});

// GET list of all sessions (temp)
app.get('/allsessions', (req, res, next) => {
  db.query('SELECT * FROM sessions')
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch(error => { next(error); });
});

// GET images from given session
app.post('/imagelist', (req, res, next) => {
  db.query(`SELECT * FROM images
              JOIN sessionImages ON images.imageID = sessionImages.imageID
              WHERE sessionImages.sessionID = ${req.body.sessionId}`)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch(err => next(err));
});

// GET all from any session
app.get('/allimages', (req, res, next) => {
  db.query('SELECT * FROM images')
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch(err => next(err));
});

// PATCH to update image properties
app.patch('/image', (req, res, next) => {
  if (!req.body['given-name'] && req.body.category) next(`Empty PATCH request body: ${req.body}`);
  const patchGivenName = req.body['given-name'] ? `userGivenName = '${req.body['given-name']}',` : '';
  const patchCategory = req.body.category ? `category = '${req.body.category}'` : '';

  const updateQuery = `UPDATE images
                        SET ${patchGivenName} ${patchCategory}
                        WHERE imageId = ${req.body.imageId};`;
  db.query(updateQuery)
    .then(rows => {
      res.status(200).json(rows);
    })
    .catch(error => { next(error); });
});

// POST to update image to all
app.post('/updateImage/:category', (req, res, next) => {

  pushImageToAll(req.body.fileName, req.params.category);
  res.json({ message: 'Updating image ...' });
});

// DELETE to clear images (within category) from all
app.delete('/updateImage/:category/:fileName', (req, res, next) => {
  if (req.params.fileName === 'all') {
    clearAllImages(req.params.category);
    res.json({ message: 'Clearing image(s) ...' });
  } else {
    clearSecondaryImage(req.params);
    res.json({ message: 'Clearing one secondary image ...' });
  }
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
                            images (filename, userGivenName, category)
                          VALUES ('${req.file.filename}',
                            '${req.body['given-name']}',
                            '${req.body.category}'
                            )`;
  db.query(insertImageSQL)
    .then(result => {
      responseObject = {
        imageId: result[0].insertId,
        fileName: req.file.filename,
        userGivenName: req.body['given-name'],
        category: req.body.category
      };

      const insertSessionImageSQL = `INSERT INTO
                                      sessionImages (sessionId, imageId)
                                    VALUES ('1', '${result[0].insertId}')`;
      db.query(insertSessionImageSQL)
        .then(() => {
        })
        .catch(error => { next(error); });
    })
    .then(result => {
      res.status(200).json(responseObject);
    })
    .catch(error => { next(error); });
});

// POST to add user to user sockets object
app.post('/userJoined', (req, res, next) => {
  userSockets[req.body.socketId].userName = req.body.playerConfig.userName;
  res.status(200).json({ message: `${req.body.playerConfig.userName} connected` });
});

// POST to add session to launched sessions
const launchedSessions = [];
app.post('/launchSession', (req, res, next) => {
  launchedSessions.push(req.body.sessionConfig);
  moveUsertoRoom(req.body.sessionConfig, req.body.socketId);
  res.status(200).json({ message: `launched session "${req.body.sessionConfig.sessionName}"`, launchedSessions });
});

// Socket io set up and incoming event handling
const userSockets = {};
const socketArray = [];
io.on('connection', socket => {
  socketArray.push(socket);
  userSockets[socket.id] = { socket };
  socket.emit('connected', socket.id);
  socket.on('disconnect', reason => {
    delete userSockets[socket.id];

  });

  socket.on('error', error => {
    console.error('Sockect.io error:', error);
  });
});

function pushImageToAll(fileName, category) {
  for (const socket of socketArray) {
    socket.emit(`update${category}Image`, fileName);
  }
  return fileName;
}

function clearAllImages(category) {
  for (const socket of socketArray) {
    socket.emit(`update${category}Image`, null);
  }
}

function clearSecondaryImage(paramObject) {

  for (const socket of socketArray) {
    socket.emit('clearOneImage', paramObject.fileName);
  }
}

function moveUsertoRoom(sessionConfig, socketId) {

  const socket = userSockets[socketId].socket;
  const sessionRoom = `${sessionConfig.sessionName} (${sessionConfig.sessionId})`;
  socket.join(sessionRoom, () => {
    io.to(sessionRoom).emit('update', `${userSockets[socketId].userName} has joined ${sessionRoom}`);
  });

}
// Error Handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

http.listen(3001, () => {
  // eslint-disable-next-line
  console.log('listening on 3001 ...'); });
