import { Component, Input } from '@angular/core';

import { Post } from '../../../../interfaces/post';
import { AuthService } from '../../../../services/auth.service';
import { PostsService } from '../../../../services/posts.service';

@Component({
  selector: 'app-list-item-post',
  template: `
    <div class="template-list-item">
      <ng-container *ngTemplateOutlet="templatePhotoURLs"></ng-container>

      <ng-container *ngIf='type === "listItem" && post.replyPostId'>
        <ng-container *ngTemplateOutlet="templateReplyPostId"></ng-container>
      </ng-container>

      <ng-container *ngTemplateOutlet="templateContent"></ng-container>

      <ng-container *ngIf='type !== "listItem"'>
        <ng-container *ngTemplateOutlet="templateActions"></ng-container>
      </ng-container>

      <ng-container *ngIf='type === "listItem"'>
        <ng-container *ngTemplateOutlet="templateListItemActions"></ng-container>
      </ng-container>
    </div>

    <ng-template #templateReplyPostId>
      <div class="template-replyPostId">
        <a routerLink="/posts/{{post.replyPostId}}">{{post.replyPostId}}</a>
      </div>
    </ng-template>

    <ng-template #templatePhotoURLs>
      <ng-container *ngIf="post.photoURLs.length">
        <div class="template-photoURLs">
          <ng-container *ngFor="let photoURL of post.photoURLs">
            <img *ngIf="isDefaultType" [src]="photoURL | resize:resize">
            <img *ngIf="isListItemType" routerLink="/posts/{{post.id}}" [src]="photoURL | resize:resize">
          </ng-container>
        </div>
      </ng-container>
    </ng-template>

    <ng-template #templateContent>
      <div class="template-content" routerLink="/posts/{{post.id}}">
        <ng-container *ngIf="post.content">
          <p class='text'>{{post.content}}<span class="createdAt">- {{post.createdAt | elapsedDate}}</span></p>
        </ng-container>
        <ng-container *ngIf="!post.content">
          <p><span class="createdAt">- {{post.createdAt | elapsedDate}}</span></p>
        </ng-container>
      </div>
    </ng-template>

    <ng-template #templateListItemActions>
      <div class='template-actions'>
        <ng-container *ngTemplateOutlet="templateChipSet"></ng-container>
      </div>
    </ng-template>

    <ng-template #templateActions>
      <div class='template-actions'>
        <ng-container *ngTemplateOutlet="templateChipSet"></ng-container>
      </div>
    </ng-template>

    <ng-template #templateChipSet>
      <div mdc-chip-set>
        <ng-container *ngFor="let tag of post.tags">
          <div mdc-chip (click)="onUpdateTag(tag.name)">
            <div mdc-chip-text>{{tag.name}} {{tag.count}}</div>
          </div>
        </ng-container>
        <ng-container *ngIf="isLogged && !isEditNewTag">
          <button mdc-chip class='mdc-chip--button' (click)="onEditNewTag()">
            <i mdc-chip-icon leading material-icons>add</i>
            <div class='fix-height'></div>
          </button>
        </ng-container>
        <ng-container *ngIf="isLogged && isEditNewTag">
          <div mdc-chip>
            <i mdc-chip-icon leading material-icons>add</i>
            <input
              mdc-chip-text
              [(ngModel)]="newTag"
              [disabled]="isLoadingMutation"
              class='mdc-chip__text--editable'
              placeholder='いいね'
              (blur)="onUpdateTag(newTag)"
            >
          </div>
        </ng-container>
      </div>
    </ng-template>

    <ng-template #suffixInputTag>
      <i *ngIf="isLoadingMutation" class="anticon anticon-loading anticon-spin"></i>
      <i *ngIf="!isLoadingMutation" class="anticon anticon-plus"></i>
    </ng-template>
  `,
  styleUrls: ['list-item-post.component.scss'],
})
export class ListItemPostComponent {
  @Input() post: Post;
  @Input() type = 'default';
  @Input() isLogged: boolean;

  public resize = 'post';
  public isEditNewTag = false;
  public isLoadingMutation = false;
  public isDeleteMutate = false;
  public isDelete = false;
  public newTag = '';

  constructor(
    private posts: PostsService,
    public authService: AuthService,
  ) {
  }

  public get deleteType() {
    return this.isDelete ? 'danger' : null;
  }

  public get deleteShape() {
    return this.isDelete ? null : 'circle';
  }

  public get isDefaultType() {
    return this.type === 'default';
  }

  public get isListItemType() {
    return this.type === 'listItem';
  }

  public onUpdateTag(name = 'スキ') {
    if (!this.authService.currentUser) {
      return;
    }

    if (this.isLoadingMutation) {
      return;
    }

    this.isLoadingMutation = true;

    if (name === '') {
      this.isEditNewTag = false;
      this.isLoadingMutation = false;
      return;
    }

    const post$ = this.posts.updatePostTag({postId: this.post.id, name});

    post$.subscribe((res) => {
      this.isEditNewTag = false;
      this.isLoadingMutation = false;
      this.newTag = '';
    }, (err) => {
      console.error(err);
      this.isLoadingMutation = false;
    });
  }

  public onDelete() {
    if (!this.isDelete) {
      this.isDelete = true;
      return;
    }

    if (this.isDeleteMutate) {
      return;
    }

    this.isDeleteMutate = true;

    if (this.post.replyPostId) {
      const postId$ = this.posts.deleteReplyPost(this.post.id);
      postId$.subscribe(() => {
        this.isDeleteMutate = false;
      }, (err) => {
        this.isDeleteMutate = false;
      });
    }
  }

  public onEditNewTag() {
    this.isEditNewTag = true;
  }
}
