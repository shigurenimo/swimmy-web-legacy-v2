import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-threads',
  template: `
    <app-header></app-header>

    <ng-container *ngTemplateOutlet="templateSearch;"></ng-container>

    <div class="template-posts">
      <app-card-thread
        *ngFor="let node of posts"
        [content]="node.content"
        [createdAt]="node.createdAt"
        [id]="node.id"
        [photoURLs]="node.photoURLs"
        [ownerId]="node.ownerId"
        [owner]="node.owner"
        [repliedPostCount]="node.repliedPostCount"
        [repliedPostIds]="node.repliedPostIds"
        [tags]="node.tags"
        [updatedAt]="node.updatedAt">
      </app-card-thread>
    </div>

    <ng-template #templateSearch>
      <div class="template-search">
        <div nz-row nzType="flex" [nzGutter]="8">
      <span nz-col class="text-input">
        <input nz-input [(ngModel)]="searchText" placeholder="スレッド検索">
      </span>
          <span nz-col>
        <button nz-button (click)="onSearch()">
          <i class="anticon anticon-search"></i>
          <span>探す</span>
        </button>
      </span>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['view-threads.scss']
})
export class ViewThreadsComponent implements OnInit, OnDestroy {
  private posts$$;
  private authState$$;

  public posts: Post[] = [];
  public searchText = '';

  constructor (
    private postsService: PostsService,
    private afAuth: AngularFireAuth) {
  }

  private onChangeAuthState () {
    this.onSearch();
  }

  public onSearch () {
    const posts$ = this.postsService.getPostsAsThread(this.searchText);
    this.posts$$ = posts$.subscribe((res) => {
      this.posts = res.hits;
    });
  }

  ngOnInit () {
    const authState$ = this.afAuth.authState;
    this.authState$$ = authState$.subscribe(() => {
      this.onChangeAuthState();
    });
  }

  ngOnDestroy () {
    this.authState$$.unsubscribe();
    this.posts$$.unsubscribe();
  }
}
