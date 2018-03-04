import * as admin from 'firebase-admin'

import { IMAGES } from '../../constants/index'

/**
 * Set /apps/{appId}/issues/{issueId} to /users/{uid}/apps-issues/{issueId}
 * @param {string} imageId
 * @param {Object} image
 */
export const setImage = (imageId, image) => {
  if (!imageId) {
    throw new Error('imageId not found')
  }

  return admin.firestore()
    .collection(IMAGES)
    .doc(imageId)
    .set(image)
    .then(() => {
      return { ...image, id: imageId }
    })
}
