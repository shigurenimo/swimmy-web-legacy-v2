import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import { Post } from '../../interfaces/post';
import { BrowserService } from '../../services/browser.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-threads',
  template: `
    <ng-container *ngTemplateOutlet="templateSearch"></ng-container>

    <div class="template-posts">
      <div mdc-list two-line>
        <ng-container *ngFor="let post of posts">
          <app-list-item-thread [post]='post'></app-list-item-thread>
          <div mdc-list-divider></div>
        </ng-container>
      </div>
    </div>

    <ng-template #templateSearch>
      <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
        <div mdc-text-field fullwidth withTrailingIcon class='text-field-search'>
          <input mdc-text-field-input formControlName="text" placeholder='スレッド検索'>
          <i mdc-text-field-icon role="button">search</i>
          <div mdc-line-ripple></div>
        </div>
      </form>
    </ng-template>
  `,
  styleUrls: ['view-threads.component.scss'],
})
export class ViewThreadsComponent implements OnInit, OnDestroy {
  public searchForm;
  public posts: Post[] = [];

  private posts$$;
  private authState$$;

  constructor(
    private postsService: PostsService,
    private afAuth: AngularFireAuth,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    const authState$ = this.afAuth.authState;
    this.searchForm = new FormGroup({text: new FormControl()});
    this.authState$$ = authState$.subscribe(() => {
      this.onChangeAuthState();
    });
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  ngOnDestroy() {
    this.authState$$.unsubscribe();
    this.posts$$.unsubscribe();
  }

  private onChangeAuthState() {
    this.onSearch();
  }

  public onSearch() {
    const text = this.searchForm.get('text').value || '';
    const posts$ = this.postsService.getPostsAsThread(text);
    this.posts$$ = posts$.subscribe((res) => {
      this.posts = res.hits;
    });
  }
}
