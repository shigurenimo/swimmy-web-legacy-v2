import { firestore } from 'firebase-functions';
import { updatePostObject } from '../api/posts/updatePostObject';
import { setUserPost } from '../api/users-posts/setUserPost';

const document = firestore.document('posts/{postId}');

export = document.onUpdate(async (change, context) => {
  const { postId } = context.params;
  const post = change.after.data();

  await Promise.all([
    post.ownerId &&
    setUserPost(post.ownerId, postId, post)
  ]);

  await updatePostObject(postId, post);
});
