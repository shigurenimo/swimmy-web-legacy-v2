import * as admin from 'firebase-admin'

export const updateAuthDisplayName = (uid, input) => {
  if (!input) {
    throw new Error('input not found')
  }

  if (typeof input.displayName === 'undefined') {
    throw new Error('input.displayName not found')
  }

  if (typeof input.photoURL === 'undefined') {
    throw new Error('input.photoURL not found')
  }

  if (!uid) {
    throw new Error('uid not found')
  }

  return admin.auth().updateUser(uid, {
    displayName: input.displayName,
    photoURL: input.photoURL
  })
}
