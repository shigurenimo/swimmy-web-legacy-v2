import { getTag } from '../../api/tags/getTag';
import { getTags } from '../../api/tags/getTags';
import { getUser } from '../../api/users/getUser';
import { getUserByUsername } from '../../api/users/getUserByUsername';

export const Query = {
  tag(root, { id }) {
    return getTag(id);
  },
  tags(root) {
    return getTags({ limit: 40 });
  },
  hello() {
    return {
      hello: 'hello!',
    };
  },
  user(root, { id, username }) {
    if (username) {
      return getUserByUsername(username);
    } else {
      return getUser(id);
    }
  },
  viewer(root, args, context) {
    return {
      user: context.user,
    };
  },
};
