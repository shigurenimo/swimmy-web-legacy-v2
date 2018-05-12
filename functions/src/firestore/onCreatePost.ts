import * as functions from 'firebase-functions';

import { setPostAsPhoto } from '../api/posts/setPostAsPhoto';
import { setPostAsThread } from '../api/posts/setPostAsThread';
import { updatePostObject } from '../api/posts/updatePostObject';
import { updatePostRepliedPostCount } from '../api/posts/updatePostRepliedPostCount';
import { setUserPost } from '../api/users-posts/setUserPost';
import { isPostAsPhoto } from '../utils/isPostAsPhoto';
import { isPostAsThread } from '../utils/isPostAsThread';

const document = functions.firestore.document('posts/{postId}');

export = document.onCreate(async (snapshot, context) => {
  const post = snapshot.data();
  const { postId } = context.params;

  await Promise.all([
    post.ownerId &&
    setUserPost(post.ownerId, postId, post),
    post.replyPostId &&
    updatePostRepliedPostCount(post.replyPostId),
    isPostAsPhoto(post) &&
    setPostAsPhoto,
    isPostAsThread(post) &&
    setPostAsThread
  ]);

  await updatePostObject(postId, post);
})
