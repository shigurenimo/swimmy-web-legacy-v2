import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';

import { Post } from '../../../../interfaces/post';
import { BrowserService } from '../../../../services/browser.service';
import { PostsService } from '../../../../services/posts.service';

@Component({
  selector: 'app-view-home',
  template: `
    <ng-container *ngTemplateOutlet="templateSearch"></ng-container>

    <div class="template-posts">
      <div mdc-list two-line>
        <ng-container *ngFor="let post of (posts$ | async) as posts">
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
  styleUrls: ['view-home.component.scss'],
})
export class ViewHomeComponent implements OnInit {
  public searchForm;
  public posts$: Observable<Post[]>;

  constructor(
    private postsService: PostsService,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    this.searchForm = new FormGroup({text: new FormControl()});
    this.onSearch();
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  public onSearch() {
    const text = this.searchForm.get('text').value || '';
    this.posts$ = this.postsService.getPostsAsThread(text);
  }
}
