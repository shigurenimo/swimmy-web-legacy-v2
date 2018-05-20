export const getStorageURL = (objectPath: string): string => {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG);
  return `gs://${projectId}.appspot.com/${objectPath}`;
};
