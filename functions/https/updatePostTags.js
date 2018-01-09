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

    let user = null;

    let data = null;

    return admin.firestore().runTransaction(t => {
      return t.get(Doc)
        .then(doc => {
          data = doc.data();
          return admin.auth().verifyIdToken(idToken);
        })
        .then((decodedToken) => {
          user = decodedToken;

          const tags = data.tags || [];

          const tagIndex =
            tags.findIndex(tag => tag.name === body.name);

          if (tagIndex > -1) {
            const tag = tags[tagIndex];
            const index = tag.uids.findIndex(uid => uid === user.uid);
            if (index > -1) {
              if (tags[index].count < 2) {
                tags.splice(index, 1);
              } else {
                tags[index].uids.splice(index, 1);
                tags[index].count = Number(tags[index].count) - 1;
              }
            } else {
              tags[index].uids.push(user.uid);
              tags[index].count = Number(tags[index].count) + 1;
            }
          } else {
            tags.push({
              name: body.name,
              count: 1,
              uids: [user.uid]
            });
          }

          return t.update(Posts.doc(body.id), {
            tags: tags
          });
        });
    })
      .then(() => {
        res.status(200).json();
      })
      .catch((err) => {
        console.log('ERROR!', err);
        res.status(500).json(err);
      });
  });
});
