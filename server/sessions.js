const path = require('path');
const session = require('express-session');
const sessionFileStore = require('session-file-store');

const FileStore = sessionFileStore(session);

const store = new FileStore({
  path: path.join(__dirname, 'sessions/')
});

const sessions = session({
  cookie: {
    sameSite: true
  },
  store: store,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  secret: 'thisisthesecretandstuff'
});

module.exports = sessions;
