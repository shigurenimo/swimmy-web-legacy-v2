import * as functions from 'firebase-functions';

import { deletePostObject } from '../api/algolia/deletePostObject';
import { updatePostRepliedPostCount } from '../api/posts/updatePostRepliedPostCount';
import { deleteTags } from '../api/tags/deleteTags';
import { deleteUserPost } from '../api/users-posts/deleteUserPost';
import { failureLog } from '../helpers/failureLog';
import { getEventData } from '../helpers/getEventData';

export = functions.firestore
  .document('posts/{postId}')
  .onDelete(async (event) => {
    const post = getEventData(event);

    const {postId} = event.params;

    try {
      await Promise.all([
        post.ownerId &&
        deleteUserPost(post.ownerId, postId),
        deletePostObject(postId),
        deleteTags(post.tags),
        post.replyPostId &&
        updatePostRepliedPostCount(post.replyPostId, -1)
      ]);
    } catch (err) {
      failureLog(err);
    }
  })
