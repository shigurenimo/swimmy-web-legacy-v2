import { Component, Input } from '@angular/core';

import { createdAt } from '../helpers/createdAt';
import { Post } from '../models/Post';

@Component({
  selector: 'app-list-item-post',
  templateUrl: './list-item-post.component.html',
  styleUrls: ['./list-item-post.component.css']
})
export class ListItemPostComponent {
  @Input() doc: Post;

  isOpen = false;

  private onOpenClick() {
    this.isOpen = !this.isOpen;
  }

  get createdAt() {
    return createdAt(this.doc.createdAt);
  }
}
