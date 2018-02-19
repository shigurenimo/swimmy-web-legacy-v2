import * as functions from 'firebase-functions';

import {setPostToUser} from '../api/users/setPost';

import {failureLog} from '../helpers/failureLog';
import {getEventData} from '../helpers/getEventData';

export default functions.firestore.
  document('posts/{postId}').
  onCreate((event) => {
    const post = getEventData(event);

    const {postId} = event.params;

    return Promise.all([
      setPostToUser(post.owner.uid, postId, post),
    ]).
      catch((err) => {
        return failureLog(err);
      });
  });
