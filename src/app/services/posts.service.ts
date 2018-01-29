import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';

import { postsQuery } from '../queries/posts';
import { updatePostTag } from '../queries/updatePostTag';

@Injectable()
export class PostsService {

  constructor(private apollo: Apollo) {
  }

  public updateTag(variables) {
    return this.apollo
      .mutate({
        mutation: updatePostTag,
        variables
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
