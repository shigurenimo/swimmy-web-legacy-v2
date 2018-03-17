import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';
import { POSTS } from '../../constants';
import { getTime } from '../../helpers/getTime';

export const getPostObject = async (id: string) => {
  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  let index = client.initIndex(POSTS);

  const getProcessingTime = getTime();

  const post = await index.getObject(id);

  console.log(`getObject(${id}): ${getProcessingTime()}ms`);

  return post;
};
