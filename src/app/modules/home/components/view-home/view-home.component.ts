import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Post } from '../../../../interfaces/post';
import { AuthService } from '../../../../services/auth.service';
import { BrowserService } from '../../../../services/browser.service';
import { PostsService } from '../../../../services/posts.service';

@Component({
  selector: 'app-view-home',
  template: `
    <app-form-post-new></app-form-post-new>

    <ul mdc-list>
      <ng-container *ngFor="let node of posts">
        <app-list-item-post
          [post]='node'
          [isLogged]="isLogged"
          type="listItem"
        >
        </app-list-item-post>
        <div mdc-list-divider></div>
      </ng-container>
    </ul>
  `,
  styleUrls: ['view-home.component.scss'],
})
export class ViewHomeComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  public isLogged = false;

  private posts$$;
  private authState$$;

  constructor(
    private postsService: PostsService,
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
    if (this.authState$$) {
      this.authState$$.unsubscribe();
    }
    if (this.posts$$) {
      this.posts$$.unsubscribe();
    }
  }

  private onChangeAuthState(user) {
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
}
