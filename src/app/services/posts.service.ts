import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';

import { queryPosts } from '../queries/posts';
import { mutationUpdatePostTag } from '../queries/updatePostTag';

@Injectable()
export class PostsService {

  constructor(private apollo: Apollo) {
  }

  public updateTag(variables) {
    return this.apollo
      .use('mutation')
      .mutate({
        mutation: mutationUpdatePostTag,
        variables
      });
  }

  public getDocs() {
    return this.apollo
      .watchQuery<any>({query: queryPosts})
      .valueChanges;
  }

  public readDocs() {
    return this.apollo
      .getClient()
      .readQuery({query: queryPosts});
  }
}
