import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';
import { POSTS } from '../../constants';

export const deletePostObject = async (postId: string) => {
  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  const index = client.initIndex(POSTS);

  await index.deleteObject(postId);
};
