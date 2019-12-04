const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const multer = require('multer');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');
const db = require('./_config');

// make public folder files available, such as index.html
const staticPath = path.join(__dirname, 'public');
const staticMiddleware = express.static(staticPath);
app.use(staticMiddleware);
app.use(bodyParser.json());

// images GET
app.get('/imagelist', (req, res) => {
  db.promise().query('SELECT * FROM images')
    .then(([rows]) => {
      res.status(200).json(rows);
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
app.post('/upload', upload.single('image-upload'), (req, res) => {
  res.status(200).json({ filename: req.body.filename });
});

http.listen(3001, () => { console.log('listening ...'); });
