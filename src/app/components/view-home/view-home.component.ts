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
  // subscriptions
  private posts$$;
  private authState$$;

  // ui states
  public posts: Post[] = [];
  public isLogged = false;

  // errors
  public graphQLErrors = [];
  public networkError = null;

  constructor(
    private postsService: PostsService,
    private afAuth: AngularFireAuth) {
  }

  private onCatchError({graphQLErrors, networkError}) {
    if (graphQLErrors[0]) {
      console.error(graphQLErrors);
      this.graphQLErrors = graphQLErrors;
    }
    if (!networkError.ok) {
      console.error(networkError);
      this.networkError = networkError;
    }
  }

  private onChangeAuthState(user) {
    if (user) {
      this.isLogged = true;
    }
    const posts$ = this.postsService.observePosts();
    this.posts$$ = posts$.subscribe(({data}) => {
      this.posts = data.posts.nodes;
    }, (err) => {
      this.onCatchError(err);
    });
  }

  public ngOnInit() {
    const authState$ = this.afAuth.authState;
    this.authState$$ = authState$.subscribe((user) => {
      this.onChangeAuthState(user);
    });
  }

  public ngOnDestroy() {
    this.authState$$.unsubscribe();
    this.posts$$.unsubscribe();
  }
}
