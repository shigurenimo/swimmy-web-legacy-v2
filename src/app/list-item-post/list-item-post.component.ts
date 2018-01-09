import { Component, Input } from '@angular/core';

import { createdAt } from '../helpers/createdAt';
import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-list-item-post',
  templateUrl: './list-item-post.component.html',
  styleUrls: ['./list-item-post.component.css']
})
export class ListItemPostComponent {
  @Input() aud: string;

  @Input() content: string;

  @Input() createdAt: string;

  @Input() id: string;

  @Input() images: string[];

  @Input() owner: object;

  @Input() ownerId: string;

  @Input() repliedPostIds: string[];

  @Input() replyPostIds: string[];

  @Input() updatedAt: string;

  isOpen = false;

  constructor(private fns: FunctionsService) {
  }

  private onOpenClick() {
    this.isOpen = !this.isOpen;
  }

  public get createdAtStr() {
    return createdAt(this.createdAt);
  }

  public onUpdateTagClick() {
    const payload = {
      id: this.id,
      name: '+1'
    };
    this.fns.updatePostTags(payload)
      .then(() => {
      })
      .catch(err => {
        console.error(err);
      });
  }
}
