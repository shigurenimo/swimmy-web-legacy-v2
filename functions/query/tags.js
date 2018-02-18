import {getTags} from '../api/tags/getTags';

export default (root) => {
  return getTags({limit: 40});
};
