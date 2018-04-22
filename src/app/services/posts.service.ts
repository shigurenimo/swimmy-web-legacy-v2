import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { PostsResult } from '../interfaces/Post';

import {
  queryPhotoPosts,
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
      mutation: gql`
        mutation addPost($input: AddPostInput!) {
          addPost(input: $input) {
            id
            content
            createdAt
            ownerId
            owner {
              id
              displayName
              photoURL
            }
            photoURLs
            repliedPostCount
            replyPostId
            tags {
              id
              name
              count
            }
            updatedAt
          }
        }
      `,
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
      mutation: gql`
        mutation addPost($input: AddPostInput!) {
          addPost(input: $input) {
            id
            content
            createdAt
            ownerId
            owner {
              id
              displayName
              photoURL
            }
            photoURLs
            repliedPostCount
            replyPostId
            tags {
              id
              name
              count
            }
            updatedAt
          }
        }
      `,
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
      pollInterval: 120000
    }).valueChanges;
  }

  public observeThreadPosts(variables) {
    return this.apollo.watchQuery<PostsResult>({
      query: queryThreadPosts,
      pollInterval: 120000,
      variables
    }).valueChanges;
  }

  public observeRepliedPosts(replyPostId) {
    return this.apollo.watchQuery<PostsResult>({
      query: queryRepliedPosts,
      pollInterval: 120000,
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

  public getPhotoPosts(startAt?) {
    return this.apollo.watchQuery<PostsResult>({
      query: queryPhotoPosts
    }).valueChanges;
  }

  public deleteReplyPost(id, replyPostId) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deletePost($id: ID!) {
          deletePost(id: $id)
        }
      `,
      variables: {id},
      update: (store, {data: {deletePost: nodeId}}) => {
        const query = queryRepliedPosts;
        const variables = {replyPostId};
        const storeData = store.readQuery({query, variables}) as any;
        const index = storeData.posts.nodes.findIndex((node) => {
          return node.id === nodeId;
        });
        const data = update(storeData, {
          posts: {nodes: {$splice: [[index, 1]]}}
        });
        store.writeQuery({query, variables, data});
      }
    });
  }
}
