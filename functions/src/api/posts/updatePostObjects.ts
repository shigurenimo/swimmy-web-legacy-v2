import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';
import { POSTS } from '../../constants';
import { createPostObject } from './createPostObject';

export const updatePostObjects = async (posts) => {
  if (!posts) {
    throw new Error('posts not found');
  }

  if (!posts.length) {
    console.log('posts.length == 0');
    return;
  }

  const objects = posts.map((post) => {
    return createPostObject(post.id, post);
  });

  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  const index = client.initIndex(POSTS);

  try {
    await index.saveObjects(objects);
  } catch (e) {
    console.error('ERROR!');
    e;
  }
};
