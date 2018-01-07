const admin = require('firebase-admin');
const functions = require('firebase-functions');
const errors = require('./errors');

const cors = require('cors')({origin: true});

module.exports = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const authorization = req.headers.authorization || {};

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json(errors.TOKEN_NOT_FOUND);
    }

    const idToken = authorization.split('Bearer ')[1];

    const body = req.body;

    const Posts = admin.firestore().collection('posts');

    admin.auth().verifyIdToken(idToken)
      .then((decodedToken) => {
        const {aud, uid, name} = decodedToken;
        return Posts.add({
          aud,
          images: [],
          ownerId: uid,
          owner: {name},
          content: body.content,
          createdAt: new Date(),
          repliedPostIds: [],
          replyPostIds: null,
          updatedAt: new Date()
        });
      }).then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      console.log('ERROR!', err);
      res.status(500).json(err);
    });
  });
});
