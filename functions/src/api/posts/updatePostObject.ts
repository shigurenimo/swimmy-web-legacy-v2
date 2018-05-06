import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';
import { POSTS } from '../../constants';
import { createPostObject } from './createPostObject';

export const updatePostObject = async (objectID, post) => {
  const object = createPostObject(objectID, post);

  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  const index = client.initIndex(POSTS);

  try {
    await index.saveObject(object);
  } catch (e) {
    console.error(e);
  }
};
