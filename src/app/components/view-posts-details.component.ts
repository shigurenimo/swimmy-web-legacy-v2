import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-view-posts-details',
  template: `
    <app-header [goBack]="true">
      <ng-template #title>
        <span>スレッド</span>
      </ng-template>
    </app-header>
    
    <nz-content *ngIf="post">
      <div class="template-post">
        <app-card-post
          [content]="post.content"
          [createdAt]="post.createdAt"
          [id]="post.id"
          [photoURLs]="post.photoURLs"
          [ownerId]="post.ownerId"
          [owner]="post.owner"
          [repliedPostIds]="post.repliedPostIds"
          [replyPostId]="post.replyPostId"
          [tags]="post.tags"
          [updatedAt]="post.updatedAt"
          [isLogged]="isLogged">
        </app-card-post>
      </div>

      <div class="template-message">
        <i class="anticon anticon-up"></i>
      </div>

      <div class="template-editor">
        <app-card-reply-new [repliedPostId]="post.id">
        </app-card-reply-new>
      </div>

      <div class="template-replied-posts">
        <div class="card" *ngFor="let node of repliedPosts">
          <app-card-post
            [content]="node.content"
            [createdAt]="node.createdAt"
            [id]="node.id"
            [photoURLs]="node.photoURLs"
            [ownerId]="node.ownerId"
            [owner]="node.owner"
            [repliedPostIds]="node.repliedPostIds"
            [replyPostId]="node.replyPostId"
            [tags]="node.tags"
            [updatedAt]="node.updatedAt"
            [isLogged]="isLogged">
          </app-card-post>
        </div>
      </div>
    </nz-content>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }

    :host ::ng-deep .ant-layout-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: scroll;
      padding: 0 8px 40px;
    }

    .template-post {
      margin: 0 auto;
      width: 100%;
      max-width: 800px;
    }

    .template-message {
      padding-top: 16px;
      text-align: center;
      font-size: 16px;
    }

    .template-editor {
      margin: 0 auto;
      padding-top: 16px;
      width: 100%;
      max-width: 800px;
    }

    .template-replied-posts {
      margin: 0 auto;
      width: 100%;
      max-width: 800px;
    }

    .template-replied-posts .card {
      padding-top: 16px;
    }
  `]
})
export class ViewPostsDetailsComponent implements OnInit, OnDestroy {
  private authState$$ = null;
  private params$$ = null;
  private posts$$ = null;
  private repliedPosts$$ = null;

  public isLogged = false;
  public post = null;
  public repliedPosts = [];

  constructor (
    private posts: PostsService,
    private activatedRoute: ActivatedRoute,
    private afAuth: AngularFireAuth) {
  }

  private onCatchError (err) {
    console.error(err)
  }

  private onChangePost () {

  }

  private onChangeParams (params) {
    const { postId } = params;

    const posts$ = this.posts.observePost(postId);
    this.posts$$ = posts$.subscribe((doc) => {
      this.post = doc;
    }, (err) => {
      this.onCatchError(err);
    });

    const repliedPosts$ = this.posts.observeRepliedPosts(postId);
    this.repliedPosts$$ = repliedPosts$.subscribe((docs) => {
      this.repliedPosts = docs;
    }, (err) => {
      this.onCatchError(err);
    });
  }

  private onChangeAuthState (user) {
    if (user) {
      this.isLogged = true;
    }
    this.params$$ = this.activatedRoute.params.subscribe((params) => {
      this.onChangeParams(params);
    });
  }

  public ngOnDestroy () {
    if (this.params$$) {
      this.params$$.unsubscribe();
    }
    this.authState$$.unsubscribe();
    this.posts$$.unsubscribe();
    this.repliedPosts$$.unsubscribe();
  }

  public ngOnInit () {
    const authState$ = this.afAuth.authState;
    this.authState$$ = authState$.subscribe((user) => {
      this.onChangeAuthState(user);
    });
  }
}
