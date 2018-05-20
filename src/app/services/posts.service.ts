import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { AddPostInput, UpdatePostTagInput } from '../interfaces/mutation';
import { Post } from '../interfaces/post';
import { mutationUpdatePostTag } from '../queries/updatePostTag';
import { AlgoliaService } from './algolia.service';

@Injectable()
export class PostsService {

  constructor (
    private afs: AngularFirestore,
    private apollo: Apollo,
    private algoliaService: AlgoliaService
  ) {
  }

  private fixPost (doc) {
    doc.photoURLs = Object.keys(doc.photoURLs).map((id) => {
      return doc.photoURLs[id].photoURL;
    });
    doc.tags = Object.keys(doc.tags).map((id) => {
      return doc.tags[id];
    });
    return doc;
  }

  private fixPosts (docs: any[]) {
    return docs.map((doc) => {
      doc.photoURLs = Object.keys(doc.photoURLs).map((id) => {
        return doc.photoURLs[id].photoURL;
      });
      doc.tags = Object.keys(doc.tags).map((id) => {
        return doc.tags[id];
      });
      return doc;
    });
  }

  public addPost (input: AddPostInput) {
    return this.apollo.mutate({
      mutation: gql`
        mutation addPost($input: AddPostInput!) {
          addPost(input: $input) {
            id
          }
        }
      `,
      variables: { input }
    });
  }

  public addReplyPost (input: AddPostInput) {
    return this.apollo.mutate({
      mutation: gql`
        mutation addPost($input: AddPostInput!) {
          addPost(input: $input) {
            id
          }
        }
      `,
      variables: { input }
    });
  }

  public updatePostTag (input: UpdatePostTagInput) {
    return this.apollo.mutate({
      mutation: mutationUpdatePostTag,
      variables: { input }
    });
  }

  public observePost (postId: string) {
    return this.afs.doc<Post>(`posts-as-anonymous/${postId}`)
      .valueChanges()
      .map(this.fixPost);
  }

  public observePosts (query: (ref: any) => any) {
    return this.afs.collection<Post>('posts-as-anonymous', query)
      .valueChanges()
      .map(this.fixPosts);
  }

  public getPostsAsThread (query: string) {
    const promise = this.algoliaService.postsAsThread.search(query);
    return fromPromise(promise);
  }

  public observePostsAsThread (query: (ref: any) => any) {
    return this.afs.collection<Post>('posts-as-thread', query)
      .valueChanges()
      .map(this.fixPosts);
  }

  public getPostsAsPhoto (query: (ref: any) => any) {
    return this.afs.collection<Post>('posts-as-photo', query)
      .valueChanges()
      .map(this.fixPosts);
  }

  public observeRepliedPosts (replyPostId: string) {
    const query = (ref) => {
      return ref.where('replyPostId', '==', replyPostId);
    };
    return this.afs.collection<Post>('posts', query)
      .valueChanges()
      .map(this.fixPosts);
  }

  public deleteReplyPost (id: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deletePost($id: ID!) {
          deletePost(id: $id)
        }
      `,
      variables: { id }
    });
  }
}
