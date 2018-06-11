import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { BrowserService } from '../../../../services/browser.service';
import { PostsService } from '../../../../services/posts.service';

@Component({
  selector: 'app-view-detail',
  template: `
    <ng-container *ngIf="(post$ | async) as post">
      <ul mdc-list>
        <app-list-item-post [post]='post' [isLogged]="isLogged"></app-list-item-post>
        <div mdc-list-divider></div>
      </ul>

      <div class="template-message">
        <i mdc-icon>keyboard_arrow_up</i>
      </div>

      <div class="template-editor">
        <app-form-reply-new [repliedPostId]="post.id"></app-form-reply-new>
      </div>
    </ng-container>
    
    <ul mdc-list>
      <ng-container *ngFor="let repliedPost of (repliedPosts$ | async)">
        <app-list-item-reply [post]='repliedPost' [isLogged]="isLogged"></app-list-item-reply>
        <div mdc-list-divider></div>
      </ng-container>
    </ul>
  `,
  styleUrls: ['view-detail.component.scss'],
})
export class ViewDetailComponent implements OnInit {
  public post$;
  public repliedPosts$;

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private browserService: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    const {postId} = this.activatedRoute.snapshot.params;

    this.post$ = this.postsService.observePost(postId);
    this.repliedPosts$ = this.postsService.observeRepliedPosts(postId);

    this.browserService.updateSnapshot(this.activatedRoute.snapshot);
  }

  public get isLogged(): boolean {
    return !!this.authService.auth.currentUser;
  }
}
