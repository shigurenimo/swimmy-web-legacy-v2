import { firestore } from 'firebase-functions';

import { setPostAsPhoto } from '../api/posts/setPostAsPhoto';
import { updatePostRepliedPostCount } from '../api/posts/updatePostRepliedPostCount';
import { setUserPost } from '../api/users-posts/setUserPost';
import { isPostAsPhoto } from '../utils/isPostAsPhoto';

const document = firestore.document('posts/{postId}');

export = document.onCreate(async (snapshot, context) => {
  const post = snapshot.data();
  const { postId } = context.params;

  await Promise.all([
    post.ownerId &&
    setUserPost(post.ownerId, postId, post),
    post.replyPostId &&
    updatePostRepliedPostCount(post.replyPostId),
    isPostAsPhoto(post) &&
    setPostAsPhoto(postId, post)
  ]);

  // await updatePostObject(postId, post);
})
