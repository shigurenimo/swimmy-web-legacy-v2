import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';

export const updateObjects = (name, documents) => {
  if (!name) {
    throw new Error('name not found');
  }

  if (!documents) {
    throw new Error('documents not found');
  }

  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  const index = client.initIndex(name);

  const objects = documents.map((document) => {
    return { ...document, objectID: document.id }
  })

  return new Promise((resolve, reject) => {
    index.saveObjects(objects, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
