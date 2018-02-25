import * as admin from 'firebase-admin'

export const updateAuthDisplayName = (uid, input) => {
  if (!input) {
    throw new Error('input not found')
  }

  if (!input.email) {
    throw new Error('input.email not found')
  }

  if (!uid) {
    throw new Error('uid not found')
  }

  return admin.auth()
    .updateUser(uid, {
      displayName: input.email.match(/^[^@]+/)[0]
    })
}
