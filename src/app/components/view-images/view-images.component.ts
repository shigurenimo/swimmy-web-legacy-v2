import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.css']
})
export class ViewImagesComponent implements OnInit, OnDestroy {
  public authState$$;

  public posts: Post[] = [];

  // errors
  public graphQLErrors = [];
  public networkError = null;

  constructor (
    private postsService: PostsService,
    private afAuth: AngularFireAuth) {
  }

  private onCatchError ({ graphQLErrors, networkError }) {
    if (graphQLErrors[0]) {
      console.error(graphQLErrors);
      this.graphQLErrors = graphQLErrors;
    }
    if (!networkError.ok) {
      console.error(networkError);
      this.networkError = networkError;
    }
  }

  private onChangeAuthState () {
    const posts$ = this.postsService.getPhotoPosts();
    const posts$$ = posts$.subscribe(({ data }) => {
      data.posts.nodes.forEach((node, index) => {
        setTimeout(() => {
          this.posts.push(node);
        }, index * 50)
      });
      posts$$.unsubscribe();
    }, (err) => {
      this.onCatchError(err);
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
