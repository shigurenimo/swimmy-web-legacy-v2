import * as functions from 'firebase-functions'

import { POSTS } from '../../constants'

import { deleteObject } from './deleteObject'

export const deletePostObject = (appId) => {
  const { projectId } = functions.config().firebase;
  const index = `${projectId}:${POSTS}`

  return deleteObject(index, appId)
}
