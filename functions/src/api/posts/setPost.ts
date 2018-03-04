import * as admin from 'firebase-admin'

import { POSTS, TAGS } from '../../constants/index'
import { COUNT } from '../../constants/tags'
import { getPhotoURL } from '../microservices/getPhotoURL'

/**
 * Set /posts/{postId}
 * @param {string} postId
 * @param {Object} input
 * @param {Object} owner
 * @return {Promise}
 */
export const setPost = async (postId, input, owner) => {
  const createdAt = new Date()

  const newPost = {
    id: postId,
    content: input.content,
    createdAt: createdAt,
    ownerId: null,
    owner: null,
    photoURLs: {},
    repliedPostCount: 0,
    replyPostId: input.replyPostId || null,
    tags: {},
    updatedAt: createdAt
  }

  if (owner) {
    newPost.ownerId = owner.uid
    newPost.owner = {
      uid: owner.uid,
      displayName: owner.displayName,
      photoURL: owner.photoURL
    }
  }

  newPost.photoURLs = {}

  input.photoURLs = input.photoURLs || []
  input.photoIds = input.photoIds || []

  if (input.photoURLs[0] && input.photoIds[0]) {
    for (let i = 0; i < input.photoIds.length; ++i) {
      const photoId = input.photoIds[i]
      const photoURL = input.photoURLs[i]
      const data = await getPhotoURL('apps', photoId, photoURL)
      newPost.photoURLs[photoId] = data
    }
  }

  const tagQuerySnapshot = await admin.firestore()
    .collection(TAGS)
    .orderBy(COUNT)
    .limit(1)
    .get()

  const snapshot = tagQuerySnapshot.docs[0]

  if (snapshot) {
    const data = snapshot.data()

    newPost.tags[snapshot.id] = {
      name: data.name,
      count: 0,
      createdAt: createdAt,
      updatedAt: createdAt
    }
  }

  return admin.firestore().collection(POSTS).doc(postId).set(newPost).then(() => {
    return Object.assign(newPost, { id: postId })
  })
}
