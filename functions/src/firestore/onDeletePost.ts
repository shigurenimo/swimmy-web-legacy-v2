import * as functions from 'firebase-functions';

import { deletePostObject } from '../api/algolia/deletePostObject';
import { deleteTags } from '../api/tags/deleteTags';
import { failureLog } from '../helpers/failureLog';
import { getEventData } from '../helpers/getEventData';

export = functions.firestore
  .document('posts/{postId}')
  .onDelete(async (event) => {
    const post = getEventData(event);

    const { postId } = event.params;

    try {
      await Promise.all([
        deleteTags(post.tags),
        deletePostObject(postId)
      ]);
    } catch (err) {
      failureLog(err);
    }
  })
