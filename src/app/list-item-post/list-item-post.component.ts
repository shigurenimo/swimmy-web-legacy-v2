import { Component, Input } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { createdAt } from '../helpers/createdAt';
import { updateTags } from '../helpers/updateTags';
import { PostsService } from '../services/posts.service';

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

  @Input() plus;

  @Input() repliedPostIds: string[];

  @Input() replyPostIds: string[];

  @Input() tags;

  @Input() updatedAt: string;

  public isOpen = false;

  public newTag = '';

  constructor(
    public afa: AngularFireAuth,
    private posts: PostsService) {
  }

  private onOpenClick() {
    this.isOpen = !this.isOpen;
  }

  public get createdAtStr() {
    return createdAt(this.createdAt);
  }

  public onUpdateTag(name = 'like') {
    if (!this.afa.auth.currentUser) {
      return;
    }
    this.posts.updateTag({
      id: this.id,
      name: name
    })
      .subscribe(({data}) => {
        const tag = data.updatePostTag;
        this.tags = updateTags(this.tags, tag);
      }, (err) => {
        console.log(err);
      });
  }

  public onAddTag() {
    const variables = {
      id: this.id,
      name: this.newTag
    };
    if (!this.afa.auth.currentUser) {
      return;
    }
    this.posts.updateTag(variables)
      .subscribe(() => {
      }, (err) => {
        console.log(err);
      });
  }
}
