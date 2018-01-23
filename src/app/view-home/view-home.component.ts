import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Post } from '../models/Post';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.css']
})
export class ViewHomeComponent implements OnInit {
  public nodes$: Observable<Post>;

  constructor(private posts: PostsService) {
  }

  public ngOnInit() {
    this.nodes$ = this.posts.getDocs();
  }
}
