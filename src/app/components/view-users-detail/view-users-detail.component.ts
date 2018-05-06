import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-view-users-detail',
  templateUrl: './view-users-detail.component.html',
  styleUrls: ['./view-users-detail.component.css']
})
export class ViewUsersDetailComponent implements OnInit, OnDestroy {
  public createdAt;
  public description;
  public displayName = '読み込み中..';
  public followeeCount;
  public followerCount;
  public headerPhotoURL;
  public photoURL;
  public postCount;
  public file;
  public isLoading = true;

  // subscriptions
  private params$$;

  // errors
  public graphQLErrors = [];
  public networkError = null;

  constructor (
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    public afAuth: AngularFireAuth) {
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

  private onChangeUser ({ data }) {
    const user = data.user as User;
    this.createdAt = user.createdAt;
    this.description = user.description;
    this.displayName = user.displayName;
    this.followeeCount = user.followeeCount;
    this.followerCount = user.followerCount;
    this.headerPhotoURL = user.headerPhotoURL;
    this.photoURL = user.photoURL;
    this.postCount = user.postCount;
    this.isLoading = false;
  }

  public ngOnInit () {
    this.params$$ = this.activatedRoute.params.subscribe((params) => {
      this.onChangeParams(params);
    });
  }

  public ngOnDestroy () {
    if (this.params$$) {
      this.params$$.unsubscribe();
    }
  }

  private onChangeParams (params) {
    const { username } = params;
    this.isLoading = true;
    const user$ = this.usersService.getUser(null, username);
    user$.subscribe((data) => {
      this.onChangeUser(data);
    }, (err) => {
      this.onCatchError(err);
    });
  }
}
