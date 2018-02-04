const admin = require('firebase-admin');

exports.default = (args, user) => {
  return admin.firestore().runTransaction((t) => {
    const newTagId = admin.firestore().collection('tags').doc().id;

    const postRef = admin.firestore().
      collection('posts').
      doc(args.id);

    const userPostTagsRef = admin.firestore().
      collection('users').
      doc(user.uid).
      collection('post-tags').
      doc(args.id);

    const tagNameRef = admin.firestore().
      collection('tags').
      where('name', '==', args.name);

    return Promise.all([
      t.get(postRef),
      t.get(userPostTagsRef),
      t.get(tagNameRef),
    ]).
      then(([postSnapshot, userPostTagsSnapshot, tagSnapshots]) => {
        const createdAt = new Date();

        const tagSnapshot = tagSnapshots.docs[0];

        const tagExists = tagSnapshot && tagSnapshot.exists;

        const post = postSnapshot.data();

        const postTags = post.tags;

        const postTagId = tagExists
          ? Object.
            keys(postTags).
            filter((tagId) => postTags[tagId].name === args.name)[0]
          : newTagId;

        const postTag = tagExists
          ? postTags[postTagId]
          : {
            count: 1,
            createdAt: createdAt,
            name: args.name,
            updatedAt: createdAt,
          };


        const postTagExists = !!postTag;

        const userPostTagExists = userPostTagsSnapshot.exists
          && !!userPostTagsSnapshot.data()
          && !!userPostTagsSnapshot.data()[postTagId];

        // Postに同じ名前のタグが存在する
        if (postTagExists) {
          // 既にユーザが持っている
          if (userPostTagExists) {
            postTag.count = postTag.count - 1;
            postTags[postTagId] = postTag;

            if (postTag.count < 1 && postTag.name !== 'like') {
              delete postTags[postTagId];
            }

            t.update(userPostTagsRef, {
              [postTagId]: admin.firestore.FieldValue.delete(),
            });
          }

          // ユーザが持っていない
          if (!userPostTagExists) {
            postTag.count = postTag.count + 1;
            postTags[postTagId] = postTag;

            t.set(userPostTagsRef, {
              [postTagId]: {
                createdAt: createdAt,
              },
            }, {merge: true});
          }

          t.update(postRef, {
            tags: postTags,
          });
        }

        // Postに同じ名前のタグが存在しない
        if (!postTagExists) {
          t.set(userPostTagsRef, {
            [postTagId]: {
              createdAt: createdAt,
            },
          }, {merge: true});

          postTags[postTagId] = postTag;

          t.update(postRef, {
            tags: postTags,
          });
        }

        // タグが存在する
        if (tagExists) {
          const tag = tagSnapshot.data();
          const tagRef = admin.firestore().
            collection('tags').
            doc(tagSnapshot.id);
          const count = tag.count + (userPostTagExists ? -1 : 1);
          if (count < 1) {
            if (tag.name !== 'like') {
              t.delete(tagRef);
            }
          } else {
            t.update(tagRef, {
              count: count,
              updatedAt: createdAt,
            });
          }
        }

        // タグが存在しない
        if (!tagExists) {
          const tagRef = admin.firestore().
            collection('tags').
            doc(postTagId);
          t.set(tagRef, postTag);
        }

        post.tags[postTagId] = postTag;

        return Object.assign({id: postTagId}, postTag);
      });
  });
};
