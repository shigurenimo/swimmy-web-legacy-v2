export const isPostAsThread = (post: any) => {
  return post.repliedPostCount > 0
}
