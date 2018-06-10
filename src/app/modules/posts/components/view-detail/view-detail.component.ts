import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { BrowserService } from '../../../../services/browser.service';
import { PostsService } from '../../../../services/posts.service';

@Component({
  selector: 'app-view-detail',
  template: `
    <ng-container *ngIf="post">
      <ul mdc-list>
        <app-list-item-post
          [post]='post'
          [isLogged]="isLogged"
          type="listItem"
        >
        </app-list-item-post>
        <div mdc-list-divider></div>
      </ul>

      <div class="template-message">
        <i mdc-icon>keyboard_arrow_up</i>
      </div>

      <div class="template-editor">
        <app-form-reply-new [repliedPostId]="post.id"></app-form-reply-new>
      </div>

      <ul mdc-list>
        <ng-container *ngFor="let post of repliedPosts">
          <app-list-item-post
            [post]='post'
            [isLogged]="isLogged"
          >
          </app-list-item-post>
          <div mdc-list-divider></div>
        </ng-container>
      </ul>
    </ng-container>
  `,
  styleUrls: ['view-detail.component.scss'],
})
export class ViewDetailComponent implements OnInit, OnDestroy {
  public isLogged = false;
  public post = null;
  public repliedPosts = [];
  private authState$$ = null;
  private params$$ = null;
  private posts$$ = null;
  private repliedPosts$$ = null;

  constructor(
    private posts: PostsService,
    private authService: AuthService,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    const authState$ = this.authService.authState();
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