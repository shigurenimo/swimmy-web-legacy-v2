import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';

export const updateObjects = async (name, objects) => {
  if (!name) {
    throw new Error('name not found');
  }

  if (!objects) {
    throw new Error('objects not found');
  }

  if (!objects.length) {
    console.log('objects.length == 0');
    return;
  }

  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  const index = client.initIndex(name);

  try {
    await index.saveObjects(objects);
  } catch (e) {
    console.log('ERROR!');
    e;
  }
};
