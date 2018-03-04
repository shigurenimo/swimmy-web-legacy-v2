import * as admin from 'firebase-admin'

const { USERS } = require('../../constants/index')

export const getUsers = (query) => {
  return admin.firestore()
    .collection(USERS)
    .get()
    .then(({ docs }) => {
      return docs.map((snapshot) => {
        const doc = snapshot.data()
        return Object.assign(doc, { id: snapshot.id })
      })
    })
}
