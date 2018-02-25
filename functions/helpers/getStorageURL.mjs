import * as functions from 'firebase-functions/lib/index'

export const getStorageURL = (bucketName, objectPath) => {
  const {projectId} = functions.config().firebase
  return `gs://${projectId}.appspot.com/${bucketName}/${objectPath}`
}
