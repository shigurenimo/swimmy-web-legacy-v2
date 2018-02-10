import { Component, OnDestroy, OnInit } from '@angular/core';

import { PostsService } from '../services/posts.service';
import { Post } from '../interfaces/Post';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.css']
})
export class ViewHomeComponent implements OnInit, OnDestroy {
  public posts$;

  public posts: Post[] = [];

  constructor(private postsService: PostsService) {
  }

  public ngOnInit() {
    this.posts$ = this.postsService
      .getDocs()
      .subscribe(({data}) => {
        this.posts = data.posts.nodes;
      });
  }

  public ngOnDestroy() {
    this.posts$.unsubscribe();
  }
}
