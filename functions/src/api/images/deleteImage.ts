import * as admin from 'firebase-admin'

import { IMAGES } from '../../constants/index'

/**
 * Delete /images/{imageId}
 * @param {string} imageId
 */
export const deleteImage = (imageId) => {
  if (!imageId) {
    throw new Error('imageId not found')
  }

  return admin.firestore()
    .collection(IMAGES)
    .doc(imageId)
    .delete()
    .then(() => {
      return imageId
    })
}
