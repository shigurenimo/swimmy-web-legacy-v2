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
  private params$$ = null
  private posts$$ = null

  // errors
  public graphQLErrors = [];
  public networkError = null;

  constructor(
    private posts: PostsService,
    private activatedRoute: ActivatedRoute) {
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

  private onChangePost() {

  }

  private onChangeParams(params) {
    const {postId} = params
    console.log(postId);
    const posts$ = this.posts.observePost(postId)
    this.posts$$ = posts$.subscribe(({data}) => {
      console.log(data)
    }, (err) => {
      this.onCatchError(err)
    })
    /*
    const user$ = this.usersService.getUser(null, username);
    user$.subscribe((data) => {
      this.onChangeUser(data);
    }, (err) => {
      this.onCatchError(err);
    });
    */
  }

  public ngOnDestroy() {
    if (this.params$$) {
      this.params$$.unsubscribe();
    }
  }

  public ngOnInit() {
    this.params$$ = this.activatedRoute.params.subscribe((params) => {
      this.onChangeParams(params);
    });
  }
}
