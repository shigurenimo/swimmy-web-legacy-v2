import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';

export const deleteObject = (name, objectID) => {
  if (!objectID) {
    throw new Error('objectID not found');
  }

  if (!name) {
    throw new Error('name not found');
  }

  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  const index = client.initIndex(name);

  return new Promise((resolve, reject) => {
    index.deleteObject(objectID, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
