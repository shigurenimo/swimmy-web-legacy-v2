import { firestore } from 'firebase-functions';

import { deletePostAsPhoto } from '../api/posts-as-photo/deletePostAsPhoto';
import { deletePostAsThread } from '../api/posts-as-thread/deletePostAsThread';
import { updatePostRepliedPostCount } from '../api/posts/updatePostRepliedPostCount';
import { deleteTags } from '../api/tags/deleteTags';
import { deleteUserPost } from '../api/users-posts/deleteUserPost';
import { isPostAsPhoto } from '../utils/isPostAsPhoto';
import { isPostAsThread } from '../utils/isPostAsThread';

const document = firestore.document('posts/{postId}');

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

  await Promise.all([
    isPostAsPhoto(post) &&
    deletePostAsPhoto(postId),
    isPostAsThread(post) &&
    deletePostAsThread(postId)
  ]);

  // await deletePostObject(postId);
})
