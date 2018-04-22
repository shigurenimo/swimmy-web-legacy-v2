import * as functions from 'firebase-functions';

import { deletePostObject } from '../api/posts/deletePostObject';
import { updatePostRepliedPostCount } from '../api/posts/updatePostRepliedPostCount';
import { deleteTags } from '../api/tags/deleteTags';
import { deleteUserPost } from '../api/users-posts/deleteUserPost';

const document = functions.firestore.document('posts/{postId}');

export = document.onDelete(async (snapshot, context) => {
  const post = snapshot.data();

  const { postId } = context.params;

  await Promise.all([
    post.ownerId &&
    deleteUserPost(post.ownerId, postId),
    deleteTags(post.tags),
    post.replyPostId &&
    updatePostRepliedPostCount(post.replyPostId, -1)
  ]);

  await deletePostObject(postId);
})
