import { getTag } from '../api/tags/getTag'

export default (root, {id}) => {
  return getTag(id)
};
