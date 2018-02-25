const api = 'firebasestorage.googleapis.com'
const query = 'alt=media'

export const toStorageURL = (bucketName, photoURL) => {
  return `https://${api}/v0/b/${bucketName}/o/${photoURL}?${query}`
}
