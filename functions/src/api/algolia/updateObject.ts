import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';

export const updateObject = async (name, object) => {
  if (!object) {
    throw new Error('object not found');
  }

  if (!name) {
    throw new Error('name not found');
  }

  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  const index = client.initIndex(name);

  try {
    await index.saveObject(object);
  } catch (e) {
    console.log('ERROR!');
    e;
  }
};
