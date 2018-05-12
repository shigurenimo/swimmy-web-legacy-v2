export const getStorageURL = (objectPath) => {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG);
  return `gs://${projectId}.appspot.com/${objectPath}`;
};
