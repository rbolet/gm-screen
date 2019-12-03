const express = require('express');
const path = require('path');
const app = express();
// const http = require('http').createServer(app);
const multer = require('multer');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');

// make public folder files available, such as index.html
const staticPath = path.join(__dirname, 'public');
const staticMiddleware = express.static(staticPath);
app.use(staticMiddleware);
app.use(bodyParser.json());

// upload images
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/public/images'));
  },
  filename: (req, file, cb) => {
    var parsed = path.parse(file.originalname);
    cb(null, `${uuid()}.${parsed.ext}`);
  }
});
var upload = multer({
  storage: storage
});

app.post('/upload', upload.single('image-upload'), (req, res) => {
  // console.log(req.file.filename);
  res.status(200).json({ filename: req.file.filename });
});
