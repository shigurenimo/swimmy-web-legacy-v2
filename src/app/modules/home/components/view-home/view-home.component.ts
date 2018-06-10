import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

import { Post } from '../../../../interfaces/post';
import { AuthService } from '../../../../services/auth.service';
import { BrowserService } from '../../../../services/browser.service';
import { PostsService } from '../../../../services/posts.service';

@Component({
  selector: 'app-view-home',
  template: `
    <app-form-post-new></app-form-post-new>

    <ul mdc-list>
      <ng-container *ngFor="let post of posts$ | async as posts">
        <app-list-item-post
          [post]='post'
          [isLogged]="authService.auth.currentUser"
          type="listItem"
        >
        </app-list-item-post>
        <div mdc-list-divider></div>
      </ng-container>
    </ul>
  `,
  styleUrls: ['view-home.component.scss'],
})
export class ViewHomeComponent implements OnInit {
  public posts$: Observable<Post[]>;

  constructor(
    public authService: AuthService,
    private postsService: PostsService,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    this.posts$ = this.postsService.observePosts((ref) => {
      return ref.limit(70).orderBy('createdAt', 'desc');
    });
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }
}
