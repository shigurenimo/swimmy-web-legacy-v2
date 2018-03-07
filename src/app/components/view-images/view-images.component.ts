import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { Post } from '../../interfaces/Post';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.css']
})
export class ViewImagesComponent implements OnInit, OnDestroy {
  public authState$$;

  public posts: Post[] = [];

  constructor (
    private postsService: PostsService,
    private afAuth: AngularFireAuth) {
  }

  private onChangeAuthState () {
    const posts$ = this.postsService.getPhotoPosts();
    const posts$$ = posts$.subscribe(({ data }) => {
      data.posts.nodes.forEach((node) => {
        this.posts.push(node);
      });
      console.log(this.posts);
      posts$$.unsubscribe();
    });
  }

  public ngOnInit () {
    const authState$ = this.afAuth.authState;
    this.authState$$ = authState$.subscribe(() => {
      this.onChangeAuthState();
    });
  }

  public ngOnDestroy () {
    this.authState$$.unsubscribe();
  }
}
