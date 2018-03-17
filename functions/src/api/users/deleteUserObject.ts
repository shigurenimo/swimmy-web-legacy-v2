import * as algoliasearch from 'algoliasearch';

import { config } from '../../config';
import { USERS } from '../../constants/index';

export const deleteUserObject = async (userId) => {
  const client = algoliasearch(config.algolia.appId, config.algolia.key);

  const index = client.initIndex(USERS);

  await index.deleteObject(userId);
};
