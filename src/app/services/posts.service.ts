import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { PostsResult } from '../interfaces/Post';

import {
  mutationAddPost,
  queryPost,
  queryPosts,
  queryRepliedPosts,
  queryThreadPosts
} from '../queries/posts';
import { mutationUpdatePostTag } from '../queries/updatePostTag';

@Injectable()
export class PostsService {

  constructor(private apollo: Apollo) {
  }

  public addPost(input) {
    return this.apollo.mutate({
      mutation: mutationAddPost,
      variables: {input},
      update: (store, {data: {addPost: newPost}}) => {
        const data = store.readQuery({query: queryPosts}) as any;
        data.posts.nodes.unshift(newPost);
        store.writeQuery({query: queryPosts, data});
      }
    });
  }

  public addReplyPost(replyPostId, input) {
    return this.apollo.mutate({
      mutation: mutationAddPost,
      variables: {input: {...input, replyPostId}},
      update: (store, {data: {addPost: newPost}}) => {
        const query = queryRepliedPosts;
        const variables = {replyPostId};
        const data = store.readQuery({query, variables}) as any;
        data.posts.nodes.unshift(newPost);
        store.writeQuery({query, variables, data});
      }
    });
  }

  public updatePostTag(input) {
    return this.apollo.mutate({
      mutation: mutationUpdatePostTag,
      variables: {input}
    });
  }

  public observePosts() {
    return this.apollo.watchQuery<PostsResult>({
      query: queryPosts,
      pollInterval: 20000
    }).valueChanges;
  }

  public observeThreadPosts() {
    return this.apollo.watchQuery<PostsResult>({
      query: queryThreadPosts,
      pollInterval: 120000
    }).valueChanges;
  }

  public observeRepliedPosts(replyPostId) {
    return this.apollo.watchQuery<PostsResult>({
      query: queryRepliedPosts,
      pollInterval: 20000,
      variables: {replyPostId}
    }).valueChanges;
  }

  public observePost(id) {
    return this.apollo.watchQuery<any>({
      query: queryPost,
      pollInterval: 120000,
      variables: {id}
    }).valueChanges;
  }
}
