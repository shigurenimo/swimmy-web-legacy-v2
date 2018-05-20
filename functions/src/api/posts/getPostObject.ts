import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';
import { POSTS } from '../../constants';
import { PostObject } from '../../interfaces/post';

export const getPostObject = async (id: string): Promise<PostObject> => {
  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  let index = client.initIndex(POSTS);

  const post = await index.getObject(id);

  return post as PostObject;
};
