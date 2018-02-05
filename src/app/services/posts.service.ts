import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';

import { mutationAddPost, queryPosts } from '../queries/posts';
import { mutationUpdatePostTag } from '../queries/updatePostTag';

@Injectable()
export class PostsService {

  constructor(private apollo: Apollo) {
  }

  public add(input) {
    return this.apollo
      .use('mutation')
      .mutate({
        mutation: mutationAddPost,
        variables: {input},
        update: (store, {data: {addPost}}) => {
          const data = store.readQuery({query: queryPosts}) as any;
          data.posts.nodes.unshift(addPost);
          data.posts.nodes = data.posts.nodes.sort((a, b) => {
            return b.createdAt - a.createdAt;
          });
          store.writeQuery({query: queryPosts, data});
        }
      });
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
    const watchQuery = this.apollo.watchQuery<any>({query: queryPosts});
    console.log(watchQuery.refetch);
    /*
    setInterval(() => {
      watchQuery.refetch()
    }, 10000)
    */
    return watchQuery.valueChanges;
  }

  public readDocs() {
    return this.apollo
      .getClient()
      .readQuery({query: queryPosts});
  }
}
