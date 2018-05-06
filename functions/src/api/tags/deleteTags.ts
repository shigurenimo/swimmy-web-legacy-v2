import { toArray } from '../../utils/toArray';

import { deleteTag } from './deleteTag';

export const deleteTags = (tags) => {
  const promises = toArray(tags).map(deleteTag);

  return Promise.all(promises);
};
