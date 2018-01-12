const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const errors = require('./errors');

module.exports = functions.https.onRequest((request, response) => {
  return cors({origin: true})(request, response, () => {
    return getUser(request).
      then((user) => {
        return updatePostTag(request, user);
      }).
      then(() => {
        return successResponse(response);
      }).
      catch((err) => {
        return failureResponse(response, err);
      });
  });
});

const getUser = (request) => {
  const {authorization} = request.headers || {};
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error(errors.TOKEN_NOT_FOUND);
  }
  const idToken = request.headers.authorization.split('Bearer ')[1];
  return admin.auth().
    verifyIdToken(idToken).
    then((decodedToken) => {
      return admin.firestore().
        collection('users').
        doc(decodedToken.uid).
        get();
    }).
    then((snapshot) => {
      return snapshot.exists
        ? Object.assign({uid: snapshot.id}, snapshot.data())
        : null;
    });
};

const updatePostTag = (request, user) => {
  return admin.firestore().runTransaction((t) => {
    const ref = admin.firestore().
      collection('posts').
      doc(request.body.id);
    return t.get(ref).
      then((doc) => {
        const data = doc.data();

        const tags = data.tags || [];

        const tagIndex =
          tags.findIndex((tag) => tag.name === request.body.name);

        if (tagIndex > -1) {
          const tag = tags[tagIndex];
          const index = tag.uids.findIndex((uid) => uid === user.uid);
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
            name: request.body.name,
            count: 1,
            uids: [user.uid],
          });
        }

        return t.update(ref, {
          tags: tags,
        });
      });
  });
};

const successResponse = (res) => {
  res.end('200');
};

const failureResponse = (res, err) => {
  console.error(err);
  res.end('500');
};
