import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../interfaces/Post';

import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.css']
})
export class ViewHomeComponent implements OnInit, OnDestroy {
  public posts$$;

  public posts: Post[] = [];

  constructor (private postsService: PostsService) {
  }

  public ngOnInit () {
    const posts$ = this.postsService.getDocs();
    this.posts$$ = posts$.subscribe(({ data }) => {
      this.posts = data.posts.nodes;
    });
  }

  public ngOnDestroy () {
    this.posts$$.unsubscribe();
  }
}
