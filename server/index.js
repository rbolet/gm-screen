const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const multer = require('multer');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');
const db = require('./_config');
const io = require('socket.io')(http);

// make public folder files available, such as index.html
const staticPath = path.join(__dirname, 'public');
const staticMiddleware = express.static(staticPath);
app.use(staticMiddleware);
app.use(bodyParser.json());

// GET images from given session
app.post('/api/imagelist', (req, res, next) => {
  db.query(`SELECT * FROM images
              JOIN sessionImages ON images.imageID = sessionImages.imageID
              WHERE sessionImages.sessionID = ${req.body.sessionId}`)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch(err => next(err));
});

// GET all from any session
app.get('/api/allimages', (req, res, next) => {
  db.query('SELECT * FROM images')
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch(err => next(err));
});

// PATCH to update image properties
app.patch('/api/image', (req, res, next) => {
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

// GET list of all sessions (temp)
app.get('/api/allsessions', (req, res, next) => {
  db.query('SELECT * FROM sessions')
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch(error => { next(error); });
});

// POST to update environment image
app.post('/api/updateImage/environment', (req, res, next) => {
  pushEnvironmentImageToAll(req.body.fileName);
  res.json('Emitting filepath ...');
});

// DELETE to clear environment image
app.delete('/api/updateImage/environment', (req, res, next) => {
  clearEnvironmentImage();
  res.json('Cleared all environment images');
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
app.post('/api/upload', upload.single('image-upload'), (req, res, next) => {
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
        filename: req.file.filename,
        userGivenName: req.body['given-name']
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

// Socket io set up and incoming event handling
const socketArray = [];
io.on('connection', socket => {
  // eslint-disable-next-line
  console.log(`${socket.id} connected`);
  socketArray.push(socket);
  socket.emit('newSocketID', socket.id);
  // eslint-disable-next-line
  console.log(`There are ${socketArray.length} users connected`);

  socket.on('disconnect', reason => {
    // eslint-disable-next-line
    console.log(`${socket.id} disconnected`);

    const indexToRemove = socketArray.findIndex(socketInArray => socket.id === socketInArray.id);
    const socketSpliced = socketArray.splice(indexToRemove, 1);
    // eslint-disable-next-line
    console.log(`removed ${socketSpliced[0].id} from array, ${socketArray.length} users connected.`);
  });
});

function pushEnvironmentImageToAll(fileName) {
  for (const socket of socketArray) {
    // eslint-disable-next-line
    console.log(`sending ${fileName} to ${socket.id}`);
    socket.emit('updateEnvironmentImage', fileName);
  }
  return fileName;
}

function clearEnvironmentImage() {
  for (const socket of socketArray) {
    socket.emit('updateEnvironmentImage', null);
  }
}
// Error Handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

http.listen(3001, () => {
  // eslint-disable-next-line
  console.log('listening ...'); });
