const admin = require('firebase-admin');

exports.default = (input, user) => {
  const docId = admin.firestore().collection('posts').doc().id;

  const bucketName = 'swimmy-171720';

  const createdAt = new Date();

  const payload = {
    content: input.content,
    createdAt: createdAt,
    owner: {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    },
    photoURLs: {},
    repliedPostCount: 0,
    replyPostId: input.replyPostId || null,
    tags: {},
    updatedAt: createdAt,
  };

  input.photoURLs.forEach((photoURL) => {
    payload.photoURLs[photoURL] = {
      full: `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${photoURL}?alt=media`,
      xx512: null,
      xx1024: null,
      x512: null,
      x1024: null,
      x2048: null,
    };
  });

  return admin.firestore().
    collection('tags').
    orderBy('count').
    limit(1).
    get().
    then((snapshots) => {
      const snapshot = snapshots.docs[0];
      if (snapshot) {
        const data = snapshot.data();
        payload.tags[snapshot.id] = data;
      }
      return admin.firestore().
        collection('posts').
        doc(docId).
        set(payload);
    }).
    then(() => {
      return Object.assign(payload, {id: docId});
    });
};
