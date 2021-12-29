var admin = require('firebase-admin');

var serviceAccount = require('./firebaseServiceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://nirvana.',
});

module.exports = { admin };
