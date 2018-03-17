import * as functions from 'firebase-functions';

import { updatePostObject } from '../api/posts/updatePostObject';
import { updatePostRepliedPostCount } from '../api/posts/updatePostRepliedPostCount';
import { setUserPost } from '../api/users-posts/setUserPost';
import { getEventData } from '../helpers/getEventData';

export = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (event) => {
    const post = getEventData(event);

    const {postId} = event.params;

    await Promise.all([
      post.ownerId &&
      setUserPost(post.ownerId, postId, post),
      updatePostObject(postId, post),
      post.replyPostId &&
      updatePostRepliedPostCount(post.replyPostId)
    ]);
  })
