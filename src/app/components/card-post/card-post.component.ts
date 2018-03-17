import { Component, Input } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { createdAt } from '../../helpers/createdAt';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-card-post',
  templateUrl: './card-post.component.html',
  styleUrls: ['./card-post.component.css']
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
  @Input() replyPostIds: string[];
  @Input() tags;
  @Input() updatedAt: string;
  @Input() isLogged: boolean;

  public nzShape = 'circle';
  public resize = 'post';
  public nzPlaceHolder = 'new';
  public isEditNewTag = false;
  public isOpenReply = false;
  public isMutation = false;
  public isDeleteMutate = false;
  public newTag = '';

  constructor(
    private posts: PostsService,
    public afa: AngularFireAuth) {
  }

  public onOpenReply() {
    this.isOpenReply = !this.isOpenReply;
  }

  public get isDefaultType() {
    return this.type === 'default'
  }

  public get isListItemType() {
    return this.type === 'listItem'
  }

  public get createdAtStr() {
    return createdAt(this.createdAt);
  }

  public get isOwner() {
    return !!this.ownerId;
  }

  public onUpdateTag(name = 'スキ') {
    if (!this.afa.auth.currentUser) {
      return;
    }

    if (this.isMutation) {
      this.isMutation = true;
      return
    }

    if (name === '') {
      this.isEditNewTag = false;
      this.isMutation = false;
      return;
    }

    const post$ = this.posts.updatePostTag({postId: this.id, name});

    post$.subscribe(() => {
      this.isEditNewTag = false;
      this.isMutation = false;
      this.newTag = '';
    }, (err) => {
      console.error(err);
      this.isMutation = false;
    });
  }

  public onDelete() {
    if (!this.isDeleteMutate) {
      return;
    }

    this.isDeleteMutate = true;
  }

  public editNewTag() {
    this.isEditNewTag = true;
  }
}
