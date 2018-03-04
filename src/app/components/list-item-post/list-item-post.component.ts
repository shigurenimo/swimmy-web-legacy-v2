import { Component, Input } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { createdAt } from '../../helpers/createdAt';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-list-item-post',
  templateUrl: './list-item-post.component.html',
  styleUrls: ['./list-item-post.component.css']
})
export class ListItemPostComponent {
  @Input() content: string;

  @Input() createdAt: string;

  @Input() id: string;

  @Input() images: string[];

  @Input() owner: object;

  @Input() ownerId: string;

  @Input() repliedPostIds: string[];

  @Input() replyPostIds: string[];

  @Input() tags;

  @Input() updatedAt: string;

  public nzPlaceHolder = 'new';

  public isEditNewTag = false;

  public isOpenReply = false;

  public isMutation = false;

  public newTag = '';

  constructor(
    private posts: PostsService,
    public afa: AngularFireAuth) {
  }

  private onOpenReply() {
    this.isOpenReply = !this.isOpenReply;
  }

  public get createdAtStr() {
    return createdAt(this.createdAt);
  }

  public onUpdateTag(name = 'スキ') {
    if (!this.afa.auth.currentUser) {
      return;
    }

    if (name === '') {
      this.isEditNewTag = false;
      return;
    }

    this.isMutation = true;

    this.posts
      .updateTag({
        postId: this.id,
        name: name
      })
      .subscribe(({data}) => {
        console.log('data', data);
        this.isEditNewTag = false;
        this.isMutation = false;
        this.newTag = '';
      }, (err) => {
        console.error(err);
        this.isMutation = false;
      });
  }

  public editNewTag() {
    this.isEditNewTag = true;
  }
}
