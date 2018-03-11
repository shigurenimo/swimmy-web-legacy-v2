import { Component, Input } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { createdAt } from '../../helpers/createdAt';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-card-thread',
  templateUrl: './card-thread.component.html',
  styleUrls: ['./card-thread.component.css']
})
export class CardThreadComponent {
  @Input() content: string;
  @Input() createdAt: string;
  @Input() id: string;
  @Input() photoURLs: string[];
  @Input() owner: object;
  @Input() ownerId: string;
  @Input() repliedPostCount: number;
  @Input() repliedPostIds: string[];
  @Input() replyPostIds: string[];
  @Input() tags;
  @Input() updatedAt: string;

  public date = 'yyyy年MM月dd日'
  public nzShape = 'circle';

  public resize = 'post';

  public nzPlaceHolder = 'new';
  public isEditNewTag = false;

  public isOpenReply = false;

  public isMutation = false;
  public isDeleteMutate = false;

  public newTag = '';

  constructor (
    private posts: PostsService,
    public afa: AngularFireAuth) {
  }

  public onOpenReply () {
    this.isOpenReply = !this.isOpenReply;
  }

  public get createdAtStr () {
    return createdAt(this.createdAt);
  }

  public get isOwner () {
    return !!this.ownerId;
  }

  public onUpdateTag (name = 'スキ') {
    if (!this.afa.auth.currentUser) { return; }

    if (name === '') {
      this.isEditNewTag = false;
      return;
    }

    this.isMutation = true;

    const post$ = this.posts.updatePostTag({
      postId: this.id,
      name: name
    });

    post$.subscribe(({ data }) => {
      this.isEditNewTag = false;
      this.isMutation = false;
      this.newTag = '';
    }, (err) => {
      console.error(err);
      this.isMutation = false;
    });
  }

  public onDelete () {
    if (!this.isDeleteMutate) { return; }

    this.isDeleteMutate = true;
  }

  public editNewTag () {
    this.isEditNewTag = true;
  }
}
