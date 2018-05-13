import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { Post } from '../interfaces/post';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-view-threads',
  template: `
    <app-header></app-header>

    <nz-content *ngIf="graphQLErrors.length || networkError">
      <app-card-error-graphql *ngIf="graphQLErrors.length" [errors]="graphQLErrors">
      </app-card-error-graphql>
      <app-card-error-network *ngIf="networkError" [error]="networkError">
      </app-card-error-network>
    </nz-content>

    <nz-content *ngIf="!graphQLErrors.length && !networkError">
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
          [replyPostIds]="node.replyPostIds"
          [tags]="node.tags"
          [updatedAt]="node.updatedAt">
        </app-card-thread>
      </div>
    </nz-content>

    <ng-template #templateSearch>
      <div class="template-search">
        <div nz-row nzType="flex" [nzGutter]="8">
      <span nz-col class="text-input">
        <nz-input [(ngModel)]="searchText" [nzPlaceHolder]="placeHolder">
        </nz-input>
      </span>
          <span nz-col>
        <button
          nz-button
          (click)="onSearch()">
          <i class="anticon anticon-search"></i>
          <span>探す</span>
        </button>
      </span>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }

    .ant-layout-content {
      display: flex;
      flex-direction: column;
      padding-bottom: 40px;
      height: 100%;
      overflow-y: scroll;
    }

    .template-search {
      padding: 8px 8px 0 8px;
    }

    .template-search .text-input {
      flex: 1;
    }

    .template-posts {
      padding-top: 8px;
    }
  `]
})
export class ViewThreadsComponent implements OnInit, OnDestroy {
  private posts$$;
  private authState$$;

  public posts: Post[] = [];
  public searchText = '';
  public placeHolder = 'スレッド検索';
  public graphQLErrors = [];
  public networkError = null;

  constructor (
    private postsService: PostsService,
    private afAuth: AngularFireAuth) {
  }

  private onChangeAuthState () {
    this.onSearch();
  }

  public onSearch () {
    if (this.posts$$) {
      this.posts$$.unsubscribe();
    }
    /*
    const posts$ = this.postsService.observePostsAsThread({
      query: this.searchText
    });
    this.posts$$ = posts$.subscribe(({ data }) => {
      this.posts = data.posts.nodes || [];
    });
    */
  }

  public ngOnInit () {
    const authState$ = this.afAuth.authState;
    this.authState$$ = authState$.subscribe(() => {
      this.onChangeAuthState();
    });
  }

  public ngOnDestroy () {
    this.authState$$.unsubscribe();
    this.posts$$.unsubscribe();
  }
}
