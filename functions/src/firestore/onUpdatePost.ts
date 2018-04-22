import * as functions from 'firebase-functions';
import { updatePostObject } from '../api/posts/updatePostObject';
import { setUserPost } from '../api/users-posts/setUserPost';

export = functions.firestore
  .document('posts/{postId}')
  .onUpdate(async (snapshot, context) => {
    const { postId } = context.params;

    const post = snapshot.after.data();

    await Promise.all([
      post.ownerId &&
      setUserPost(post.ownerId, postId, post)
    ]);

    await updatePostObject(postId, post);
  });
