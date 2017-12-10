import { Component, Input } from '@angular/core';

import { Post } from '../models/Post'

@Component({
  selector: 'app-list-item-post',
  templateUrl: './list-item-post.component.html',
  styleUrls: ['./list-item-post.component.css']
})
export class ListItemPostComponent {
  @Input() doc: Post;
}
