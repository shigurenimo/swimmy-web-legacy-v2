const admin = require('firebase-admin');

const {POSTS} = require('../../constants');

/**
 * Get /posts/{postId}
 * @param {string} postId
 * @return {Promise}
 */
exports.default = (postId) => {
  if (!postId) {
    throw new Error('postId not found');
  }

  return admin.firestore().
    collection(POSTS).
    doc(postId).
    get().
    then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error('post not found');
      }

      const data = snapshot.data();

      return Object.assign(data, {id: snapshot.id});
    });
};
