import * as functions from 'firebase-functions';

import {deleteTags} from '../api/tags/deleteTags';

import {failureLog} from '../helpers/failureLog';
import {getEventData} from '../helpers/getContext';

export default functions.firestore.
  document('posts/{postId}').
  onDelete((event) => {
    const post = getEventData(event);

    return Promise.all([
      deleteTags(post.tags),
    ]).
      catch((err) => {
        return failureLog(err);
      });
  });
