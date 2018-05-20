import { Tags } from '../../types/tag';
import { toArray } from '../../utils/toArray';

import { deleteTag } from './deleteTag';

export const deleteTags = async (tags: Tags): Promise<void> => {
  const promises = toArray(tags).map(deleteTag);

  await Promise.all(promises);
};
