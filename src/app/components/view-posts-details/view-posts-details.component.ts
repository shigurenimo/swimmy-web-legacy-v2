import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-view-posts-details',
  templateUrl: './view-posts-details.component.html',
  styleUrls: ['./view-posts-details.component.css']
})
export class ViewPostsDetailsComponent implements OnInit, OnDestroy {
  public isLogged = false;

  private authState$$ = null;
  private params$$ = null;
  private posts$$ = null;

  public post = null;

  // errors
  public graphQLErrors = [];
  public networkError = null;

  constructor(
    private posts: PostsService,
    private activatedRoute: ActivatedRoute,
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

  private onChangePost() {

  }

  private onChangeParams(params) {
    const {postId} = params;
    console.log(postId);
    const posts$ = this.posts.observePost(postId);
    this.posts$$ = posts$.subscribe(({data}) => {
      this.post = data.post;
    }, (err) => {
      this.onCatchError(err);
    });
    /*
    const user$ = this.usersService.getUser(null, username);
    user$.subscribe((data) => {
      this.onChangeUser(data);
    }, (err) => {
      this.onCatchError(err);
    });
    */
  }

  private onChangeAuthState(user) {
    if (user) {
      this.isLogged = true;
    }
    this.params$$ = this.activatedRoute.params.subscribe((params) => {
      this.onChangeParams(params);
    });
  }

  public ngOnDestroy() {
    if (this.params$$) {
      this.params$$.unsubscribe();
    }
    this.authState$$.unsubscribe();
  }

  public ngOnInit() {
    const authState$ = this.afAuth.authState;
    this.authState$$ = authState$.subscribe((user) => {
      this.onChangeAuthState(user);
    });
  }
}
