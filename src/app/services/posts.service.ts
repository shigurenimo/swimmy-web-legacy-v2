import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { toArray } from '../helpers/toArray';
import { AddPostInput, UpdatePostTagInput } from '../interfaces/mutation';
import { AlgoliaService } from './algolia.service';
import { FirebaseService, fromQueryDocRef, fromQueryRef } from './firebase.service';
import { SnapshotService } from './snapshot.service';
import { ZoneService } from './zone';

@Injectable()
export class PostsService {

  constructor(
    private algoliaService: AlgoliaService,
    private firebaseService: FirebaseService,
    private snapshotService: SnapshotService,
    private zoneService: ZoneService,
  ) {
  }

  public observePost(postId: string) {
    const ref = this.firebaseService.firestore().doc(`posts-as-anonymous/${postId}`);

    return map(this.snapshotService.toPostDataFromQueryDocSnapshot)(fromQueryDocRef(ref));
  }

  public observePosts(queryFn: (ref: any) => any) {
    const ref = this.firebaseService.firestore().collection('posts-as-anonymous');

    const query = queryFn(ref);

    const observable = fromQueryRef(query).pipe(
      map(a => this.snapshotService.toPostsDataFromQuerySnapshot(a))
    );

    return this.zoneService.runOutsideAngular(observable);
  }

  public getPostsAsThread(query: string) {
    const promise = this.algoliaService.postsAsThread.search(query);

    return map((res: any) => res.hits)(from(promise));
  }

  public observePostsAsThread(queryFn: (ref: any) => any) {
    const ref = this.firebaseService.firestore().collection('posts-as-thread');

    const query = queryFn(ref);

    const observable = fromQueryRef(query).pipe(
      map(a => this.snapshotService.toPostsDataFromQuerySnapshot(a))
    );

    return this.zoneService.runOutsideAngular(observable);
  }

  public getPostsAsPhoto(queryFn: (ref: any) => any) {
    const ref = this.firebaseService.firestore().collection('posts-as-photo');

    const query = queryFn(ref);

    const observable$ = fromQueryRef(query).pipe(
      map(a => this.snapshotService.toPostsDataFromQuerySnapshot(a))
    );

    return this.zoneService.runOutsideAngular(observable$);
  }

  public observeRepliedPosts(replyPostId: string) {
    const ref = this.firebaseService.firestore().collection('posts');

    const queryFn = (ref_) => {
      return ref_.where('replyPostId', '==', replyPostId);
    };

    const query = queryFn(ref);

    const sort = posts => posts.sort((a, b) => a.createdAt - b.createdAt);

    const observable$ = fromQueryRef(query).pipe(
      map(a => this.snapshotService.toPostsDataFromQuerySnapshot(a)),
      map(sort),
    );

    return this.zoneService.runOutsideAngular(observable$);
  }

  public deleteReplyPost(id: string) {
    const func = this.firebaseService.functions().httpsCallable('deletePost');

    return from(func({ id }));
  }

  public createPost(input: AddPostInput) {
    const func = this.firebaseService.functions().httpsCallable('createPost');

    return from(func(input));
  }

  public createReplyPost(input: AddPostInput) {
    const func = this.firebaseService.functions().httpsCallable('createPost');

    return from(func(input));
  }

  public updatePostTag(input: UpdatePostTagInput) {
    const func = this.firebaseService.functions().httpsCallable('updatePostTag');

    return from(func(input));
  }
}
