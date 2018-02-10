import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { NzMessageService } from 'ng-zorro-antd';

import { User } from '../interfaces/User';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-view-user-detail',
  templateUrl: './view-user-detail.component.html',
  styleUrls: ['./view-user-detail.component.css']
})
export class ViewUserDetailComponent implements OnInit, OnDestroy {
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

  private user$;

  constructor(
    private route: ActivatedRoute,
    private users: UsersService,
    private nzMessage: NzMessageService,
    public afA: AngularFireAuth) {
  }

  public onLogout() {
    this.afA.auth
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

  public onUpload(e) {
    if (!this.afA.app.auth().currentUser) {
      return;
    }
    const uid = this.afA.app.auth().currentUser.uid;
    if (this.route.snapshot.params.uid !== uid) {
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

  public ngOnInit() {
    const uid = this.route.snapshot.params.uid;
    this.user$ = this.users
      .getDoc({id: uid})
      .subscribe(({data}) => {
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
      });
  }

  public ngOnDestroy() {
    if (this.user$) {
      this.user$.unsubscribe();
    }
  }
}
