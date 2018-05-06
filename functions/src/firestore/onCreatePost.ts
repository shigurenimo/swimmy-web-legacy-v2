import * as functions from 'firebase-functions';

import { updatePostObject } from '../api/posts/updatePostObject';
import { updatePostRepliedPostCount } from '../api/posts/updatePostRepliedPostCount';
import { setUserPost } from '../api/users-posts/setUserPost';

const document = functions.firestore.document('posts/{postId}');

export = document.onCreate(async (snapshot, context) => {
  const post = snapshot.data();
  const { postId } = context.params;

  await Promise.all([
    post.ownerId &&
    setUserPost(post.ownerId, postId, post),
    post.replyPostId &&
    updatePostRepliedPostCount(post.replyPostId)
  ]);

  await updatePostObject(postId, post);
})
