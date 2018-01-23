import { Component, Input } from '@angular/core';

import { createdAt } from '../helpers/createdAt';
import { FunctionsService } from '../services/functions.service';
import { AngularFireAuth } from 'angularfire2/auth';

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
    public afAuth: AngularFireAuth,
    private fns: FunctionsService) {
  }

  private onOpenClick() {
    this.isOpen = !this.isOpen;
  }

  public get createdAtStr() {
    return createdAt(this.createdAt);
  }

  public onUpdateTagClick() {
    const payload = {
      id: this.id
    };
    this.fns.updatePostTags(payload)
      .then(() => {
      })
      .catch(err => {
        console.error(err);
      });
  }

  public onAddTagClick() {
    const payload = {
      id: this.id,
      name: this.newTag
    };
    this.fns.updatePostTags(payload)
      .then(() => {
      })
      .catch(err => {
        console.error(err);
      });
  }
}
