import { deletePost } from '../../api/posts/deletePost';
import { getPost } from '../../api/posts/getPost';
import addPost from './addPost';
import hello from './hello';
import updatePostTag from './updatePostTag';
import updateUser from './updateUser';
import uploadPostObjects from './uploadPostObjects';

export const Mutation = {
  addPost,
  hello,
  uploadPostObjects,
  updatePostTag,
  updateUser,
  async deletePost(root, {id: postId}, {user}) {
    const post = await getPost(postId);
    await deletePost(postId, post, user);
    return postId;
  }
};
