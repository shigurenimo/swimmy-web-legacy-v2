import { Component, Input } from '@angular/core';
import { pipe } from 'rxjs/internal-compatibility';
import { tap } from 'rxjs/operators';

import { Post } from '../../../../interfaces/post';
import { AuthService } from '../../../../services/auth.service';
import { PostsService } from '../../../../services/posts.service';

@Component({
  selector: 'app-list-item-reply',
  template: `
    <!-- template photoURLs -->
    <ng-container *ngIf="post.photoURLs.length">
      <div class="template-photoURLs">
        <div class="item" *ngFor="let photoURL of post.photoURLs">
          <img [src]="photoURL | resize:'post'">
        </div>
      </div>
    </ng-container>

    <!-- template content -->
    <div class="template-content">
      <ng-container *ngIf="post.content">
        <p class='text'>{{post.content}}<span class="createdAt">- {{post.createdAt | elapsedDate}}</span></p>
      </ng-container>
      <ng-container *ngIf="!post.content">
        <p><span class="createdAt">- {{post.createdAt | elapsedDate}}</span></p>
      </ng-container>
    </div>


    <div class='template-actions'>
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
    </div>
  `,
  styleUrls: ['list-item-reply.component.scss'],
})
export class ListItemReplyComponent {
  public isEditNewTag = false;
  public isLoadingMutation = false;
  public newTag = '';

  @Input() public post: Post;
  @Input() public isLogged: boolean;

  constructor(
    private posts: PostsService,
    public authService: AuthService,
  ) {
  }

  public onUpdateTag(name: string) {
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

    const pipeline = pipe(
      tap(() => {
        this.isEditNewTag = false;
        this.isLoadingMutation = false;
      }),
    );

    pipeline(post$).subscribe((res) => {
      this.newTag = '';
    }, (err) => {
      console.error(err);
    });
  }

  public onEditNewTag() {
    this.isEditNewTag = true;
  }
}
