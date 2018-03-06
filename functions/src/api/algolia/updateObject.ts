import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';

export const updateObject = (name, objectID, document) => {
  if (!objectID) {
    throw new Error('objectID not found');
  }

  if (!name) {
    throw new Error('name not found');
  }

  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  const index = client.initIndex(name);

  const object = { ...document, objectID };

  return new Promise((resolve, reject) => {
    index.saveObject(object, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
