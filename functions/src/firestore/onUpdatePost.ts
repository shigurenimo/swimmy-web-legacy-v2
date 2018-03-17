import * as functions from 'firebase-functions';
import { updatePostObject } from '../api/posts/updatePostObject';
import { setUserPost } from '../api/users-posts/setUserPost';

import { failureLog } from '../helpers/failureLog';
import { getEventData } from '../helpers/getEventData';

export = functions.firestore
  .document('posts/{postId}')
  .onUpdate(async (event) => {
    const {postId} = event.params;

    const {current: post} = getEventData(event);

    try {
      await Promise.all([
        post.ownerId &&
        setUserPost(post.ownerId, postId, post),
        updatePostObject({...post, id: postId})
      ]);
    } catch (err) {
      failureLog(err);
    }
  });
