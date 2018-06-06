import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import { Post } from '../../interfaces/post';
import { BrowserService } from '../../services/browser.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-home',
  template: `
    <app-editor-post></app-editor-post>

    <ul mdc-list>
      <ng-container *ngFor="let node of posts">
        <app-card-post
          [post]='node'
          [isLogged]="isLogged"
          type="listItem"
        >
        </app-card-post>
        <div mdc-list-divider></div>
      </ng-container>
    </ul>
  `,
  styleUrls: ['view-home.component.scss']
})
export class ViewHomeComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  public isLogged = false;

  private posts$$;
  private authState$$;

  constructor (
    private postsService: PostsService,
    private afAuth: AngularFireAuth,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute
    ) {
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
    this.browser.updateSnapshot(this.activatedRoute.snapshot)
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
