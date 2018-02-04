import { Component, OnDestroy, OnInit } from '@angular/core';

import { PostsService } from '../services/posts.service';
import { Post } from '../models/Post';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.css']
})
export class ViewHomeComponent implements OnInit, OnDestroy {
  private subscription;

  public data: Post[] = [];

  constructor(private posts: PostsService) {
  }

  public ngOnInit() {
    this.subscription = this.posts
      .getDocs()
      .subscribe(({data}) => {
        this.data = data.posts.nodes;
      });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
