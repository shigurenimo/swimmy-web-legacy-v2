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

    if (!body.id) {
      return res.status(401).json(errors.ID_NOT_FOUND);
    }

    const Posts = admin.firestore().collection('posts');

    const Doc = Posts.doc(body.id);

    admin.firestore().runTransaction(t => {
      return t.get(Doc)
        .then(doc => {
          return admin.auth().verifyIdToken(idToken)
            .then((decodedToken) => {
              const {aud, uid, name} = decodedToken;
              const reactionsCount = doc.data().reactionsCount || [];

              const newReactionsCount = Number(reactionsCount || 0) + 1;

              return t.update(Posts.doc(body.id), {
                reactionsCount: newReactionsCount
              });
            })
            .then((data) => {
              res.status(200).json(data);
            })
            .catch((err) => {
              console.log('ERROR!', err);
              res.status(500).json(err);
            });
        });
    })
      .catch(err => {
        console.error(err);
      });
  });
});
