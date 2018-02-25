import * as admin from 'firebase-admin'

import { TAGS } from '../../constants/index'
import { DESC } from '../../constants/query'

/**
 * Get /tags
 * @return {Promise}
 */
export const getTags = ({limit}) => {
  return admin
    .firestore()
    .collection(TAGS)
    .orderBy('createdAt', DESC)
    .limit(limit)
    .get()
    .then((snapshots) => {
      return snapshots.docs.map((snapshot) => {
        const data = snapshot.data()

        return Object.assign(data, {id: snapshot.id})
      })
    })
}
