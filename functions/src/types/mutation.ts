import { addPost } from '../api/posts/addPost';
import { deletePost } from '../api/posts/deletePost';
import { getPost } from '../api/posts/getPost';
import { getPosts } from '../api/posts/getPosts';
import { updatePostObjects } from '../api/posts/updatePostObjects';
import { updatePostTag } from '../api/posts/updatePostTag';
import { updateUser } from '../api/users/updateUser';

export const Mutation = {
  async addPost(root, {input}, context) {
    console.log('mutation:addPost');

    const newPost = await addPost(input, context.user);

    return newPost;
  },
  hello(root, args, context) {
    return 'hello';
  },
  async updatePostTag(root, args, context) {
    console.log('mutation:updatePostTag');

    args.name = args.name || 'スキ';

    if (!context.user) {
      throw new Error('context.user not found');
    }

    const input = args.input;

    await updatePostTag(input, context.user);
  },
  async updateUser(root, {id, input}, context) {
    console.log('mutation:updateUser');

    if (!context.user) {
      throw new Error('context.user not found');
    }

    if (id !== context.user.uid) {
      throw new Error('not authenticated');
    }

    const newUser = await updateUser(id, input);

    return newUser;
  },
  async deletePost(root, {id: postId}, {user}) {
    console.log('mutation:deletePost');

    const post = await getPost(postId);

    await deletePost(postId, post, user);

    return postId;
  },
  async uploadPostObjects(root, {startAfter = null}) {
    console.log('mutation:refactorPostObjects');

    const posts = await getPosts({limit: 3000, startAfter});

    await updatePostObjects(posts);

    return {
      lastObjectId: posts.length ? posts[posts.length - 1].id : ''
    };
  }
};
