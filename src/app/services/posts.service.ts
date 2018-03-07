import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { PostsResult } from '../interfaces/Post';

import { mutationAddPost, queryPhotoPosts, queryPosts, queryThreadPosts } from '../queries/posts';
import { mutationUpdatePostTag } from '../queries/updatePostTag';

@Injectable()
export class PostsService {

  constructor (private apollo: Apollo) {
  }

  public addPost (input) {
    return this.apollo.mutate({
      mutation: mutationAddPost,
      variables: { input },
      update: (store, { data: { addPost: newPost } }) => {
        const data = store.readQuery({ query: queryPosts }) as any;
        data.posts.nodes.unshift(newPost);
        store.writeQuery({ query: queryPosts, data });
      }
    });
  }

  public updatePostTag (input) {
    return this.apollo.mutate({
      mutation: mutationUpdatePostTag,
      variables: { input }
    });
  }

  public observePosts () {
    return this.apollo.watchQuery<PostsResult>({
      query: queryPosts,
      pollInterval: 5000
    }).valueChanges;
  }

  public observeThreadPosts () {
    return this.apollo.watchQuery<PostsResult>({
      query: queryThreadPosts,
      pollInterval: 120000
    }).valueChanges;
  }

  public getPhotoPosts (startAt?) {
    return this.apollo.watchQuery<PostsResult>({
      query: queryPhotoPosts
    }).valueChanges;
  }
}
