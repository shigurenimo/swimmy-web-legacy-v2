import { getUser } from '../api/users/getUser';
import { getUserByUsername } from '../api/users/getUserByUsername';

export default (root, { id, username }) => {
  if (username) {
    return getUserByUsername(username);
  } else {
    return getUser(id);
  }
};
