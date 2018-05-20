import { firestore } from 'firebase-functions';
import { setPostAsAnonymous } from '../api/posts-as -anonymous/setPostAsAnonymous';

import { deletePostAsPhoto } from '../api/posts-as-photo/deletePostAsPhoto';
import { setPostAsPhoto } from '../api/posts-as-photo/setPostAsPhoto';
import { deletePostAsThread } from '../api/posts-as-thread/deletePostAsThread';
import { setPostAsThread } from '../api/posts-as-thread/setPostAsThread';
import { setUserPost } from '../api/users-posts/setUserPost';
import { Post } from '../interfaces/post';
import { createPostAsAnonymous } from '../models/posts/createPostAsAnonymous';
import { isPostAsPhoto } from '../utils/isPostAsPhoto';
import { isPostAsThread } from '../utils/isPostAsThread';

const document = firestore.document('posts/{postId}');

export = document.onUpdate(async (change, context) => {
  const post = change.after.data() as Post;

  const { postId } = context.params;

  const publicPost = createPostAsAnonymous(post);

  await Promise.all([
    setPostAsAnonymous(postId, publicPost),
    isPostAsPhoto(post)
      ? setPostAsPhoto(postId, publicPost)
      : deletePostAsPhoto(postId),
    isPostAsThread(post)
      ? setPostAsThread(postId, publicPost)
      : deletePostAsThread(postId)
  ]);

  await Promise.all([
    post.ownerId &&
    setUserPost(post.ownerId, postId, post)
  ]);

  // await updatePostObject(postId, post);
});
