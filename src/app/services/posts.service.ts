import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { pipe } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';

import { toArray } from '../helpers/toArray';
import { AddPostInput, UpdatePostTagInput } from '../interfaces/mutation';
import { AlgoliaService } from './algolia.service';
import { FirebaseService, fromQueryDocRef, fromQueryRef } from './firebase.service';
import { ZoneService } from './zone';

@Injectable()
export class PostsService {

  constructor(
    private algoliaService: AlgoliaService,
    private firebaseService: FirebaseService,
    private zoneService: ZoneService,
  ) {
  }

  public observePost(postId: string) {
    const ref = this.firebaseService.firestore().doc(`posts-as-anonymous/${postId}`);

    const observable = map(this.fixPost)(fromQueryDocRef(ref));

    return this.zoneService.runOutsideAngular(observable);
  }

  public observePosts(queryFn: (ref: any) => any) {
    const ref = this.firebaseService.firestore().collection('posts-as-anonymous');

    const query = queryFn(ref);

    const observable = map(this.fixPosts)(fromQueryRef(query));

    return this.zoneService.runOutsideAngular(observable);
  }

  public getPostsAsThread(query: string) {
    const promise = this.algoliaService.postsAsThread.search(query);

    const observable = map((res: any) => res.hits)(from(promise));

    return this.zoneService.runOutsideAngular(observable);
  }

  public observePostsAsThread(queryFn: (ref: any) => any) {
    const ref = this.firebaseService.firestore().collection('posts-as-thread');

    const query = queryFn(ref);

    const observable = map(this.fixPosts)(fromQueryRef(query));

    return this.zoneService.runOutsideAngular(observable);
  }

  public getPostsAsPhoto(queryFn: (ref: any) => any) {
    const ref = this.firebaseService.firestore().collection('posts-as-photo');

    const query = queryFn(ref);

    const observable = map(this.fixPosts)(fromQueryRef(query));

    return this.zoneService.runOutsideAngular(observable);
  }

  public observeRepliedPosts(replyPostId: string) {
    const ref = this.firebaseService.firestore().collection('posts');

    const queryFn = (ref) => {
      return ref.where('replyPostId', '==', replyPostId);
    };

    const query = queryFn(ref);

    const sort = posts => posts.sort((a, b) => a.createdAt - b.createdAt);

    const observable = pipe(map(this.fixPosts), map(sort))(fromQueryRef(query));

    return this.zoneService.runOutsideAngular(observable);
  }

  public deleteReplyPost(id: string) {
    const func = this.firebaseService.functions().httpsCallable('deletePost');

    return from(func({id}));
  }

  public addPost(input: AddPostInput) {
    const func = this.firebaseService.functions().httpsCallable('addPost');

    return from(func(input));
  }

  public addReplyPost(input: AddPostInput) {
    const func = this.firebaseService.functions().httpsCallable('addPost');

    return from(func(input));
  }

  public updatePostTag(input: UpdatePostTagInput) {
    const func = this.firebaseService.functions().httpsCallable('updatePostTag');

    return from(func(input));
  }

  private fixPost(queryDocSnapshot) {
    if (!queryDocSnapshot.exists) {
      return null;
    }

    const data = queryDocSnapshot.data();

    return {
      ...data,
      id: queryDocSnapshot.id,
      photoURLs: toArray(data.photoURLs).map(photoURL => photoURL.photoURL),
      tags: toArray(data.tags),
    };
  }

  private fixPosts(querySnapshot) {
    return querySnapshot.docs.map((queryDocSnapshot) => {
      const data = queryDocSnapshot.data();
      return {
        ...data,
        id: queryDocSnapshot.id,
        photoURLs: toArray(data.photoURLs).map(photoURL => photoURL.photoURL),
        tags: toArray(data.tags),
      };
    });
  }
}
