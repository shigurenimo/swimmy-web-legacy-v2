import { Injectable } from '@angular/core';

import * as algoliasearch from 'algoliasearch/lite';

import { environment } from '../../environments/environment';

const client = algoliasearch(environment.algolia.applicationId, environment.algolia.apiKey);

@Injectable()
export class AlgoliaService {
  public postsAsThread = client.initIndex('posts-as-thread');

  constructor() {
  }
}
