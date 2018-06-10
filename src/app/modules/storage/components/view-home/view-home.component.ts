import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Post } from '../../../../interfaces/post';
import { AuthService } from '../../../../services/auth.service';
import { BrowserService } from '../../../../services/browser.service';
import { PostsService } from '../../../../services/posts.service';

@Component({
  selector: 'app-view-home',
  template: `
    <ng-container *ngFor='let node of posts'>
      <app-card-image [post]='node'></app-card-image>
    </ng-container>
  `,
  styleUrls: ['view-home.component.scss'],
})
export class ViewHomeComponent implements OnInit, OnDestroy {
  public authState$$;

  public posts: Post[] = [];

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    const authState$ = this.authService.authState();
    this.authState$$ = authState$.subscribe(() => {
      this.onChangeAuthState();
    });
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  public ngOnDestroy() {
    this.authState$$.unsubscribe();
  }

  private onChangeAuthState() {
    const posts$ = this.postsService.getPostsAsPhoto((ref) => {
      return ref.limit(50).orderBy('createdAt', 'desc');
    });
    const posts$$ = posts$.subscribe((docs) => {
      this.posts = docs;
      posts$$.unsubscribe();
    });
  }
}
