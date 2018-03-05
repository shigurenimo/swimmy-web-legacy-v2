import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { NzMessageService } from 'ng-zorro-antd';

import { User } from '../../interfaces/User';
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

  private uploadText = 'アップロード中..';

  private params$$;

  constructor (
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private nzMessage: NzMessageService,
    public afAuth: AngularFireAuth) {
  }

  public onLogout () {
    this.afAuth.auth
      .signOut()
      .then(() => {
        const messageText = 'ログアウトしました';
        this.nzMessage.info(messageText);
      })
      .catch((err) => {
        console.error(err);
        const messageText = 'ログアウトに失敗しました';
        this.nzMessage.info(messageText);
      });
  }

  public onUpload (e) {
    if (!this.afAuth.app.auth().currentUser) {
      return;
    }
    const uid = this.afAuth.app.auth().currentUser.uid;
    if (this.activatedRoute.snapshot.params.uid !== uid) {
      return;
    }
    const uploadMessageId =
      this.nzMessage.loading(this.uploadText).messageId;
    this.file = e.file;
    const file = e.file.originFileObj;
    const filePath = `icons/${uid}`;
    const storageRef = firebase.storage().ref(filePath);
    const task = storageRef.put(file)
      .then(() => {
        this.nzMessage.remove(uploadMessageId);
      });
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
    user$.subscribe(({ data }) => {
      const user = data.user as User;
      console.log(user);
      this.createdAt = user.createdAt;
      this.description = user.description;
      this.displayName = user.displayName;
      this.followeeCount = user.followeeCount;
      this.followerCount = user.followerCount;
      this.headerPhotoURL = user.headerPhotoURL;
      this.photoURL = user.photoURL;
      this.postCount = user.postCount;
      this.isLoading = false;
    });
  }
}
