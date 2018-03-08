import * as functions from 'firebase-functions';

import { updatePostObject } from '../api/algolia/updatePostObject';
import { setUserPost } from '../api/users-posts/setUserPost';
import { failureLog } from '../helpers/failureLog';
import { getEventData } from '../helpers/getEventData';

export = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (event) => {
    const post = getEventData(event);

    const { postId } = event.params;

    try {
      await Promise.all([
        post.ownerId &&
        setUserPost(post.ownerId, postId, post),
        updatePostObject(postId, post)
      ]);
    } catch (err) {
      failureLog(err);
    }
  })
