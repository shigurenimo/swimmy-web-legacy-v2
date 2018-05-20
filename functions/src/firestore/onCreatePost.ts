import { firestore } from 'firebase-functions';

import { setPostAsPhoto } from '../api/posts-as-photo/setPostAsPhoto';
import { updatePostRepliedPostCount } from '../api/posts/updatePostRepliedPostCount';
import { setUserPost } from '../api/users-posts/setUserPost';
import { Post } from '../interfaces/post';
import { createPostAsAnonymous } from '../models/posts/createPostAsAnonymous';
import { isPostAsPhoto } from '../utils/isPostAsPhoto';

const document = firestore.document('posts/{postId}');

export = document.onCreate(async (snapshot, context) => {
  const post = snapshot.data() as Post;
  const { postId } = context.params;

  await Promise.all([
    post.ownerId &&
    setUserPost(post.ownerId, postId, post),
    post.replyPostId &&
    updatePostRepliedPostCount(post.replyPostId)
  ]);

  const publicPost = createPostAsAnonymous(post);

  await Promise.all([
    isPostAsPhoto(post) &&
    setPostAsPhoto(postId, publicPost)
  ]);
})
