import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Post } from '../../interfaces/Post';

import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.css']
})
export class ViewHomeComponent implements OnInit, OnDestroy {
  public posts$$;
  public authState$$;

  public posts: Post[] = [];

  constructor (
    private postsService: PostsService,
    private afAuth: AngularFireAuth) {
  }

  public ngOnInit () {
    const posts$ = this.postsService.observePosts();
    const authState$ = this.afAuth.authState;
    this.authState$$ = authState$.subscribe(() => {
      this.posts$$ = posts$.subscribe(({ data }) => {
        this.posts = data.posts.nodes;
      });
    });
  }

  public ngOnDestroy () {
    this.authState$$.unsubscribe();
    this.posts$$.unsubscribe();
  }
}
