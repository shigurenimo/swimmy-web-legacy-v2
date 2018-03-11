import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { Post } from '../../interfaces/Post';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-threads',
  templateUrl: './view-threads.component.html',
  styleUrls: ['./view-threads.component.css']
})
export class ViewThreadsComponent implements OnInit, OnDestroy {
  // subscriptions
  private posts$$;
  private authState$$;

  // ui states
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
    const posts$ = this.postsService.observeThreadPosts();
    this.posts$$ = posts$.subscribe(({ data }) => {
      this.posts = data.posts.nodes || [];
      console.log(this.posts)
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
    this.posts$$.unsubscribe();
  }
}
