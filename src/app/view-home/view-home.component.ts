import { Component } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { postsQuery } from '../queries/posts';
import { Post, PostsResult } from '../models/Post';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.css']
})
export class ViewHomeComponent {
  public nodes$: Observable<Post>;

  constructor(private apollo: Apollo) {
    this.getDocs();
  }

  private getDocs() {
    this.nodes$ = this.apollo
      .query({query: postsQuery})
      .map((res) => {
        return res.data as PostsResult;
      })
      .map((res) => {
        console.log(res.posts.nodes);
        return res.posts.nodes;
      });
  }
}
