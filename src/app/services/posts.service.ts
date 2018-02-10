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
      .mutate({
        mutation: mutationAddPost,
        variables: {input},
        update: (store, {data: {addPost: newPost}}) => {
          const data = store.readQuery({query: queryPosts}) as any;
          data.posts.nodes.push(newPost);
          store.writeQuery({query: queryPosts, data});
        }
      });
  }

  public updateTag(input) {
    return this.apollo
      .mutate({
        mutation: mutationUpdatePostTag,
        variables: {input}
      });
  }

  public getDocs() {
    return this.apollo
      .watchQuery<any>({
        query: queryPosts
      })
      .valueChanges;
  }
}
