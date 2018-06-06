import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { BrowserService } from '../../services/browser.service';

import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-posts-details',
  template: `
    <ng-container *ngIf="post">
      <ul mdc-list>
        <app-card-post
          [post]='post'
          [isLogged]="isLogged"
          type="listItem"
        >
        </app-card-post>
        <div mdc-list-divider></div>
      </ul>

      <div class="template-message">
        <i mdc-icon>keyboard_arrow_up</i>
      </div>

      <div class="template-editor">
        <app-card-reply-new [repliedPostId]="post.id"></app-card-reply-new>
      </div>

      <ul mdc-list>
        <ng-container *ngFor="let post of repliedPosts">
          <app-card-post
            [post]='post'
            [isLogged]="isLogged"
          >
          </app-card-post>
          <div mdc-list-divider></div>
        </ng-container>
      </ul>
    </ng-container>
  `,
  styleUrls: ['view-posts-detail.component.scss'],
})
export class ViewPostsDetailComponent implements OnInit, OnDestroy {
  private authState$$ = null;
  private params$$ = null;
  private posts$$ = null;
  private repliedPosts$$ = null;

  public isLogged = false;
  public post = null;
  public repliedPosts = [];

  constructor(
    private posts: PostsService,
    private afAuth: AngularFireAuth,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    const authState$ = this.afAuth.authState;
    this.authState$$ = authState$.subscribe((user) => {
      this.onChangeAuthState(user);
    });
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  public ngOnDestroy() {
    if (this.params$$) {
      this.params$$.unsubscribe();
    }
    this.authState$$.unsubscribe();
    this.posts$$.unsubscribe();
    this.repliedPosts$$.unsubscribe();
  }

  private onCatchError(err) {
    console.error(err);
  }

  private onChangePost() {
  }

  private onChangeParams(params) {
    const {postId} = params;

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

  private onChangeAuthState(user) {
    if (user) {
      this.isLogged = true;
    }
    this.params$$ = this.activatedRoute.params.subscribe((params) => {
      this.onChangeParams(params);
    });
  }
}
