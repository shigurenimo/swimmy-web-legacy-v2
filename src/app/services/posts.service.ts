import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';

import { postsQuery } from '../queries/posts';
import { FunctionsService } from './functions.service';
import { updatePostTag } from '../queries/updatePostTag';

@Injectable()
export class PostsService {

  constructor(
    private apollo: Apollo,
    private fns: FunctionsService) {
  }

  public updateTag(variables) {
    return this.apollo
      .mutate({
        mutation: updatePostTag,
        variables
        /*
        update(store, {data}) {
          const newData = data.updatePostTag;
          const queryData = store.readQuery({query: postsQuery}) as PostsResult;
          for (let i = 0; i < queryData.posts.nodes.length; ++i) {
            if (queryData.posts.nodes[i].id !== newData.id) {
              continue;
            }
            queryData.posts.nodes[i] = newData;
          }
          console.log(store);
          store.writeQuery({query: postsQuery, data: queryData});
        }
        */
      });
  }

  public getDocs() {
    return this.apollo
      .watchQuery<any>({query: postsQuery})
      .valueChanges
      .map(({data}) => {
        return data.posts.nodes;
      });
  }
}
