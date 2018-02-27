import fetch from 'node-fetch'
import * as functions from 'firebase-functions/lib/index'

import { config } from '../../config'

export const getPhotoURL = async (objectId) => {
  const {projectId} = functions.config().firebase

  if (!config[projectId].service.images) {
    return null
  }

  const res = await fetch(config.service.images, {
    method: 'POST',
    body: JSON.stringify({
      bucketID: `${projectId}.appspot.com`,
      objectID: objectId
    }),
    headers: {'Content-Type': 'application/json'}
  })

  if (res.ok) {
    const {data} = await res.json()
    return data
  }
}
