import { getPostObject } from '../api/posts/getPostObject';
import { getPostObjects } from '../api/posts/getPostObjects';
import { getTag } from '../api/tags/getTag';
import { getTags } from '../api/tags/getTags';
import { getUser } from '../api/users/getUser';
import { getUserByUsername } from '../api/users/getUserByUsername';

export const Query = {
  async post(root, {id}) {
    console.log('query:post');

    const post = await getPostObject(id);

    return post;
  },
  async posts(root, args) {
    console.log('query:posts');

    const nodes = await getPostObjects(args);

    return {
      nodes,
      totalCount: nodes.length
    };
  },
  tag(root, {id}) {
    return getTag(id);
  },
  tags(root) {
    return getTags({limit: 40});
  },
  test() {
    return {
      hello: 'hello!'
    };
  },
  user(root, {id, username}) {
    if (username) {
      return getUserByUsername(username);
    } else {
      return getUser(id);
    }
  },
  viewer(root, args, context) {
    return {
      user: context.user
    };
  }
};
