import {getPost} from '../api/posts/getPost';

export default (root, {id}) => {
  return getPost(id);
};
