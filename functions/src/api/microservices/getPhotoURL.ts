import * as functions from 'firebase-functions'

import fetch from 'node-fetch'

import { config } from '../../config'
import { getStorageURL } from '../../helpers/getStorageURL'
import { setImage } from '../images/setImage'

export const getPhotoURL = async (collection, photoId, downloadURL) => {
  const objectId = `${collection}/${photoId}`

  const storageURL = getStorageURL(objectId)

  const simple = {
    objectId: objectId,
    photoURL: downloadURL,
    downloadURL,
    storageURL
  }

  if (!config.service.images) {
    return simple
  }

  const { projectId } = functions.config().firebase

  const res = await fetch(config.service.images, {
    method: 'POST',
    body: JSON.stringify({
      bucketID: `${projectId}.appspot.com`,
      objectID: objectId
    }),
    headers: { 'Content-Type': 'application/json' }
  })

  if (!res.ok) {
    return simple
  }

  try {
    const { data } = await res.json()

    const image = {
      objectId: objectId,
      photoURL: data,
      downloadURL,
      storageURL
    }

    await setImage(photoId, image)

    return image
  } catch (err) {
    console.error(err)
  }

  return simple
}
