export const createPostAsAnonymous = (post: any) => {
  const newPost = post;

  newPost.ownerId = post.owner ? post.ownerId : null;

  return newPost;
};
