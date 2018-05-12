import { firestore } from 'firebase-functions';

import { deletePostAsPhoto } from '../api/posts/deletePostAsPhoto';
import { deletePostAsThread } from '../api/posts/deletePostAsThread';
import { setPostAsPhoto } from '../api/posts/setPostAsPhoto';
import { setPostAsThread } from '../api/posts/setPostAsThread';
import { setUserPost } from '../api/users-posts/setUserPost';
import { isPostAsPhoto } from '../utils/isPostAsPhoto';
import { isPostAsThread } from '../utils/isPostAsThread';

const document = firestore.document('posts/{postId}');

export = document.onUpdate(async (change, context) => {
  const { postId } = context.params;
  const post = change.after.data();

  await Promise.all([
    post.ownerId &&
    setUserPost(post.ownerId, postId, post),
    isPostAsPhoto(post)
      ? setPostAsPhoto(postId, post)
      : deletePostAsPhoto(postId),
    isPostAsThread(post)
      ? setPostAsThread(postId, post)
      : deletePostAsThread(postId)
  ]);

  // await updatePostObject(postId, post);
});
