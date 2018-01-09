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

          const reactions = data.reactions || [];

          const reactionIndex =
            reactions.findIndex(reaction => reaction.name === body.name);

          console.log('reactionIndex', reactionIndex);

          if (reactionIndex > -1) {
            const reaction = reactions[reactionIndex];
            console.log('reaction', reaction);
            const index = reaction.uids.findIndex(uid => uid === user.uid);
            console.log('index', index);
            if (index > -1) {
              if (reactions[index].count < 2) {
                reactions.splice(index, 1);
              } else {
                reactions[index].uids.splice(index, 1);
                reactions[index].count = Number(reactions[index].count) - 1;
              }
            } else {
              reactions[index].uids.push(user.uid);
              reactions[index].count = Number(reactions[index].count) + 1;
            }
          } else {
            reactions.push({
              name: body.name,
              count: 1,
              uids: [user.uid]
            });
          }

          return t.update(Posts.doc(body.id), {
            reactions: reactions
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
