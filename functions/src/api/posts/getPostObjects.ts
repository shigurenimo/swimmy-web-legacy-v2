import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';

import { PHOTOS, POSTS, THREADS } from '../../constants';

export const getPostObjects = async (args) => {
  const {
    limit = 15,
    type = 'NONE'
  } = args;

  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  let index = null;
  let filters = '';

  switch (type) {
    case 'PHOTO':
      filters = 'photoCount > 0';
      index = client.initIndex(PHOTOS);
      break;
    case 'THREAD':
      filters = 'repliedPostCount > 0 AND photoCount = 0';
      index = client.initIndex(THREADS);
      break;
    default:
      index = client.initIndex(POSTS);
      break;
  }

  const posts = await index.search({
    filters,
    hitsPerPage: limit
  });

  return posts.hits;
};
