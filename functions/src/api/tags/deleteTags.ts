import { toArray } from '../../utils/toArray'

import { deleteTag } from './deleteTag'

/**
 * Delete /tags/{tagId}
 * @param {Object} tags
 * @return {Promise}
 */
export const deleteTags = (tags) => {
  const promises = toArray(tags).map(deleteTag)

  return Promise.all(promises)
}
