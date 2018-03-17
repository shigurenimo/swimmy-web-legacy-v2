import * as admin from 'firebase-admin';
import { POSTS } from '../../constants';

export const updatePostRepliedPostCount = async (postId, count = 1) => {
  if (!postId) {
    throw new Error('postId not found');
  }

  await admin.firestore().runTransaction(async (t) => {
    const postRef = admin
      .firestore()
      .collection(POSTS)
      .doc(postId);

    const postSnapshot = await t.get(postRef);

    if (!postSnapshot.exists) return;

    const post = postSnapshot.data();
    const repliedPostCount = post.repliedPostCount + count;

    t.update(postRef, {repliedPostCount});
  });
};
