import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../interfaces/user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-view-users-detail',
  template: `
    <app-header></app-header>

    <nz-content *ngIf='graphQLErrors.length || networkError'>
      <app-card-error-graphql *ngIf='graphQLErrors.length' [errors]='graphQLErrors'>
      </app-card-error-graphql>
      <app-card-error-network *ngIf='networkError' [error]='networkError'>
      </app-card-error-network>
    </nz-content>

    <div *ngIf='!graphQLErrors.length && !networkError'>
      <div class='user-icon'>
        <nz-avatar nzIcon='code' [nzSrc]='photoURL'></nz-avatar>
      </div>
      <div class='displayName'>
        <h1 class='mat-h1'>{{displayName}}</h1>
      </div>
      <div class='profile'>
        <nz-card>
          <ng-template #body>
            <p>ここにはプロフィール機能が追加される予定です。</p>
          </ng-template>
        </nz-card>
      </div>
    </div>
  `,
  styles: [`
    :host > div {
      margin: 0 auto;
      max-width: 600px;
      padding: 8px;
    }

    .user-icon ::ng-deep .ant-avatar {
      margin: 0 auto;
      display: block;
      height: 200px;
      font-size: 100px;
      width: 200px;
      background: white;
      color: gray;
    }

    .user-icon ::ng-deep .anticon {
      line-height: 200px;
    }

    .displayName {
      padding-top: 40px;
      text-align: center;
    }

    .profile {
      padding-top: 40px;
    }
  `]
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
  private params$$;
  public graphQLErrors = [];
  public networkError = null;

  constructor (
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    public afAuth: AngularFireAuth) {
  }

  private onCatchError (err) {
  }

  private onChangeUser (user) {
    if (user) {
      this.createdAt = user.createdAt;
      this.description = user.description;
      this.displayName = user.displayName;
      this.followeeCount = user.followeeCount;
      this.followerCount = user.followerCount;
      this.headerPhotoURL = user.headerPhotoURL;
      this.photoURL = user.photoURL;
      this.postCount = user.postCount;
    }
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
    const user$ = this.usersService.getUser(username);
    user$.subscribe((data) => {
      this.onChangeUser(data);
    }, (err) => {
      this.onCatchError(err);
    });
  }
}
