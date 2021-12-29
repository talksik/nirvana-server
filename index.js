const express = require('express');
var path = require('path');

const app = express();
const port = 3000;

var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const routes = require('./routes');

const firebase = require('./firebase-setup');

// auth middleware
function checkAuth(req, res, next) {
  if (req.headers.authorization) {
    firebase.admin
      .auth()
      .verifyIdToken(req.headers.authorization)
      .then((decodedToken) => {
        let uid = decodedToken.uid;
        console.log('user Id is ' + uid);
        res.locals.uid = decodedToken.uid;
        next();
      })
      .catch(() => {
        res.status(403).send('Unauthorized');
      });
  } else {
    res.status(403).send('Unauthorized');
  }
}

app.use('/', checkAuth);

// hello world endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// agora token generator
const agora = require('./agora');
app.get(routes.agoraToken, agora.getAgoraToken);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
