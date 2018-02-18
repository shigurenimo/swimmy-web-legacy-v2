import {getUser} from '../api/users/getUser';

export default (root, {id}) => {
  return getUser(id);
};
