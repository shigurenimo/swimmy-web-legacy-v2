import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { Post } from '../interfaces/post';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-view-home',
  template: `
    <app-header>
      <ng-template #body>
        <app-editor-post></app-editor-post>
      </ng-template>
    </app-header>
    
    <nz-content>
      <app-card-post
        *ngFor="let node of posts"
        type="listItem"
        [content]="node.content"
        [createdAt]="node.createdAt"
        [id]="node.id"
        [photoURLs]="node.photoURLs"
        [ownerId]="node.ownerId"
        [owner]="node.owner"
        [replyPostId]="node.replyPostId"
        [repliedPostIds]="node.repliedPostIds"
        [tags]="node.tags"
        [updatedAt]="node.updatedAt"
        [isLogged]="isLogged">
      </app-card-post>
    </nz-content>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }

    .ant-layout-content {
      display: flex;
      flex-direction: column;
      padding-bottom: 40px;
      height: 100%;
      overflow-y: scroll;
    }
  `]
})
export class ViewHomeComponent implements OnInit, OnDestroy {
  // subscriptions
  private posts$$;
  private authState$$;

  // ui states
  public posts: Post[] = [];
  public isLogged = false;

  // errors
  public graphQLErrors = [];
  public networkError = null;

  constructor (
    private postsService: PostsService,
    private afAuth: AngularFireAuth) {
  }

  private onChangeAuthState (user) {
    if (user) {
      this.isLogged = true;
    }
    const posts$ = this.postsService.observePosts((ref) => {
      return ref.limit(70).orderBy('createdAt', 'desc');
    });
    this.posts$$ = posts$.subscribe((docs) => {
      this.posts = docs;
    });
  }

  public ngOnInit () {
    const authState$ = this.afAuth.authState;
    this.authState$$ = authState$.subscribe((user) => {
      this.onChangeAuthState(user);
    });
  }

  public ngOnDestroy () {
    if (this.authState$$) {
      this.authState$$.unsubscribe();
    }
    if (this.posts$$) {
      this.posts$$.unsubscribe();
    }
  }
}
