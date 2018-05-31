import { Component, Input } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { createdAt } from '../../helpers/createdAt';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-card-post',
  template: `
    <ng-container *ngIf='type === "default"'>
      <nz-card>
        <ng-container *ngTemplateOutlet="templatePhotoURLs"></ng-container>
        <ng-container *ngTemplateOutlet="templateContent"></ng-container>
        <ng-container *ngTemplateOutlet="templateActions"></ng-container>
      </nz-card>
    </ng-container>

    <ng-container *ngIf='type === "listItem"'>
      <div class="template-list-item">
        <ng-container *ngIf='replyPostId'>
          <ng-container *ngTemplateOutlet="templateReplyPostId"></ng-container>
        </ng-container>
        <ng-container *ngTemplateOutlet="templatePhotoURLs"></ng-container>
        <ng-container *ngTemplateOutlet="templateContent"></ng-container>
        <ng-container *ngTemplateOutlet="templateListItemActions"></ng-container>
        <ng-container *ngTemplateOutlet="templateReply"></ng-container>
      </div>
    </ng-container>

    <ng-template #templateReplyPostId>
      <div class="template-replyPostId">
        <a routerLink="/posts/{{replyPostId}}">{{replyPostId}}</a>
      </div>
    </ng-template>

    <ng-template #templatePhotoURLs>
      <ng-container *ngIf="photoURLs.length">
        <div class="template-photoURLs" nz-row nzType="flex" nzAlign="middle" nzJustify="start">
          <div class="item" nz-col *ngFor="let photoURL of photoURLs">
            <img *ngIf="isDefaultType" [src]="photoURL|resize:resize">
            <img *ngIf="isListItemType" routerLink="/posts/{{id}}" [src]="photoURL|resize:resize">
          </div>
        </div>
      </ng-container>
    </ng-template>

    <ng-template #templateContent>
      <div class="template-content">
        <ng-container *ngIf="content">
          <p *ngIf="isDefaultType">{{content}}<span class="createdAt">- {{createdAtStr}}</span></p>
          <p *ngIf="isListItemType">
            <a class='text' routerLink="/posts/{{id}}">{{content}}</a>
            <span class="createdAt">- {{createdAtStr}}</span>
          </p>
        </ng-container>
        <ng-container *ngIf="!content">
          <p><span class="createdAt">- {{createdAtStr}}</span></p>
        </ng-container>
      </div>
    </ng-template>

    <ng-template #templateListItemActions>
      <div class="template-actions" nz-row nzType="flex" nzAlign="middle">
        <nz-tag
          *ngFor="let tag of tags"
          class="tag"
          nzMode="checkable"
          nz-col
          [nzChecked]="false"
          (click)="onUpdateTag(tag.name)">
          {{tag.name}} {{tag.count}}
        </nz-tag>
        <button
          *ngIf="isLogged && !isEditNewTag"
          nz-col
          class="edit"
          nz-button
          nzShape="circle"
          [disabled]="isLoadingMutation"
          (click)="onEditNewTag()">
          <i class="anticon anticon-plus"></i>
        </button>
        <nz-input-group [nzSuffix]="suffixInputTag" *ngIf="isLogged && isEditNewTag" nz-col style="width: 140px;">
          <input
            nz-input
            [(ngModel)]="newTag"
            [readonly]="isLoadingMutation"
            placeholder="new"
            (blur)="onUpdateTag(newTag)">
        </nz-input-group>
        <!--
        <button
          class="reply"
          nz-button
          nzShape="circle"
          (click)="onOpenReply()">
          <i *ngIf="isOpenReply" class="anticon anticon-up"></i>
          <i *ngIf="!isOpenReply" class="anticon anticon-down"></i>
        </button>
        -->
      </div>
    </ng-template>

    <ng-template #templateActions>
      <div class="template-actions" nz-row nzType="flex" nzAlign="middle">
        <nz-tag
          *ngFor="let tag of tags"
          class="tag"
          nz-col
          nzMode="checkable"
          [nzChecked]="false"
          (click)="onUpdateTag(tag.name)">
          {{tag.name}} {{tag.count}}
        </nz-tag>
        <button
          *ngIf="isLogged && !isEditNewTag"
          nz-col
          class="edit"
          nz-button
          nzShape="circle"
          [disabled]="isLoadingMutation"
          (click)="onEditNewTag()">
          <i class="anticon anticon-plus"></i>
        </button>
        <nz-input-group *ngIf="isLogged && isEditNewTag" nz-col [nzSuffix]="suffixInputTag" style="width: 140px;">
          <input
            nz-input
            [(ngModel)]="newTag"
            [readonly]="isLoadingMutation"
            placeholder="new"
            (blur)="onUpdateTag(newTag)">
        </nz-input-group>
        <button
          *ngIf="ownerId"
          class="reply"
          (click)="onDelete()"
          [nzLoading]="isDeleteMutate"
          nz-button
          [nzType]="deleteType"
          [nzShape]="deleteShape">
          <i class="anticon anticon-delete"></i>
          <span *ngIf="isDelete">削除する</span>
        </button>
      </div>
    </ng-template>

    <ng-template #suffixInputTag>
      <i *ngIf="isLoadingMutation" class="anticon anticon-loading anticon-spin"></i>
      <i *ngIf="!isLoadingMutation" class="anticon anticon-plus"></i>
    </ng-template>

    <ng-template #templateReply>
      <div class="template-reply" *ngIf="isOpenReply">
        <nz-card>
          <ng-template #body>
            <p>リプライ機能は開発中です。</p>
          </ng-template>
        </nz-card>
      </div>
    </ng-template>
  `,
  styleUrls: ['card-post.component.scss']
})
export class CardPostComponent {
  @Input() type = 'default';
  @Input() content: string;
  @Input() createdAt: string;
  @Input() id: string;
  @Input() photoURLs: string[];
  @Input() owner: object;
  @Input() ownerId: string;
  @Input() repliedPostIds: string[];
  @Input() replyPostId: string;
  @Input() tags;
  @Input() updatedAt: string;
  @Input() isLogged: boolean;

  public resize = 'post';
  public isEditNewTag = false;
  public isOpenReply = false;
  public isLoadingMutation = false;
  public isDeleteMutate = false;
  public isDelete = false;
  public newTag = '';

  constructor (
    private posts: PostsService,
    public afa: AngularFireAuth) {
  }

  public get deleteType () {
    return this.isDelete ? 'danger' : null;
  }

  public get deleteShape () {
    return this.isDelete ? null : 'circle';
  }

  public onOpenReply () {
    this.isOpenReply = !this.isOpenReply;
  }

  public get isDefaultType () {
    return this.type === 'default';
  }

  public get isListItemType () {
    return this.type === 'listItem';
  }

  public get createdAtStr () {
    return createdAt(this.createdAt);
  }

  public get isOwner () {
    return !!this.ownerId;
  }

  public onUpdateTag (name = 'スキ') {
    if (!this.afa.auth.currentUser) {
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

    const post$ = this.posts.updatePostTag({ postId: this.id, name });

    post$.subscribe((res) => {
      this.isEditNewTag = false;
      this.isLoadingMutation = false;
      this.newTag = '';
    }, (err) => {
      console.error(err);
      this.isLoadingMutation = false;
    });
  }

  public onDelete () {
    if (!this.isDelete) {
      this.isDelete = true;
      return;
    }

    if (this.isDeleteMutate) {
      return;
    }

    this.isDeleteMutate = true;

    if (this.replyPostId) {
      const postId$ = this.posts.deleteReplyPost(this.id);
      postId$.subscribe(() => {
        this.isDeleteMutate = false;
      }, (err) => {
        this.isDeleteMutate = false;
      });
    }
  }

  public onEditNewTag () {
    this.isEditNewTag = true;
  }
}
