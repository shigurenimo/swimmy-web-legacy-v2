import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-view-users-detail',
  template: `
    <app-header></app-header>

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
  `,
  styleUrls: ['view-users-detail.component.scss']
})
export class ViewUsersDetailComponent implements OnInit, OnDestroy {
  private params$$;

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
    const user$ = this.usersService.getUserByUsername(username);
    user$.subscribe((data) => {
      this.onChangeUser(data);
    }, (err) => {
      this.onCatchError(err);
    });
  }
}
