import { setPostAsAnonymous } from '../api/posts-as -anonymous/setPostAsAnonymous';
import { deletePost } from '../api/posts/deletePost';
import { getPost } from '../api/posts/getPost';
import { setPost } from '../api/posts/setPost';
import { updatePostTag } from '../api/posts/updatePostTag';
import { updateUser } from '../api/users/updateUser';
import { createPost } from '../models/posts/createPost';
import { createPostAsAnonymous } from '../models/posts/createPostAsAnonymous';
import { createPostObject } from '../models/posts/createPostObject';
import { createUpdateUser } from '../models/users/createUpdateUser';
import { createId } from '../utils/createId';

export const Mutation = {
  async addPost (root, { input }, context) {
    console.log('mutation:addPost');

    const owner = context.user;

    const postId = createId();

    const newPost = await createPost(postId, input, owner);
    await setPost(postId, newPost);

    const newPostAsAnonymous = createPostAsAnonymous(newPost);
    await setPostAsAnonymous(postId, newPostAsAnonymous);

    return createPostObject(postId, newPost);
  },
  hello (root, args, context) {
    return 'hello';
  },
  async updatePostTag (root, args, context) {
    console.log('mutation:updatePostTag');

    args.name = args.name || 'スキ';

    if (!context.user) {
      throw new Error('context.user not found');
    }

    const input = args.input;

    await updatePostTag(input, context.user);
  },
  async updateUser (root, { id, input }, context) {
    console.log('mutation:updateUser');

    if (!context.user) {
      throw new Error('context.user not found');
    }

    if (id !== context.user.uid) {
      throw new Error('not authenticated');
    }

    const newUser = await createUpdateUser(context.user.uid, input);

    await updateUser(id, newUser);

    return newUser;
  },
  async deletePost (root, { id: postId }, { user }) {
    console.log('mutation:deletePost');

    const post = await getPost(postId);

    await deletePost(postId, post.onwerId, user.id);

    return postId;
  }
};
