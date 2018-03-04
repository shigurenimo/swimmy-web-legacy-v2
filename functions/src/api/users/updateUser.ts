import * as admin from 'firebase-admin'

import { USERS } from '../../constants/index'
import { getStorageURL } from '../../helpers/getStorageURL'
import { getPhotoURL } from '../microservices/getPhotoURL'

/**
 * Add User to users/{userId}
 * @param {string} uid
 * @param {Object} input
 */
export const updateUser = async (uid, input) => {
  if (!uid) {
    throw new Error('uid not found')
  }

  const updatedAt = new Date()

  const newUser = {
    updatedAt: updatedAt
  } as any

  if (input.description) {
    newUser.description = input.description
  }

  if (input.displayName) {
    newUser.displayName = input.displayName
  }

  if (input.photoURL && input.photoId) {
    const data = await getPhotoURL('users', input.photoId, input.photoURL)
    newUser.photoURLs[input.photoId] = data
    newUser.photoURL = data.photoURL
  }

  return admin.firestore()
    .collection(USERS)
    .doc(uid)
    .update(newUser)
    .then(() => {
      return Object.assign(newUser, { uid })
    })
}
