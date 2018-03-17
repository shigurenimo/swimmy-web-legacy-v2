import * as functions from 'firebase-functions';
import { updatePostObject } from '../api/posts/updatePostObject';
import { setUserPost } from '../api/users-posts/setUserPost';
import { getEventData } from '../helpers/getEventData';

export = functions.firestore
  .document('posts/{postId}')
  .onUpdate(async (event) => {
    const {postId} = event.params;

    const {current: post} = getEventData(event);

    await Promise.all([
      post.ownerId &&
      setUserPost(post.ownerId, postId, post)
    ]);

    await updatePostObject(postId, post);
  });
