import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../interfaces/User';
import { UsersService } from '../services/users.service';
import * as firebase from 'firebase/app';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-view-user-detail',
  templateUrl: './view-user-detail.component.html',
  styleUrls: ['./view-user-detail.component.css']
})
export class ViewUserDetailComponent implements OnInit, OnDestroy {
  public createdAt;

  public description;

  public followeeCount;

  public followerCount;

  public headerPhotoURL;

  public photoURL;

  public postCount;

  public file;

  private uploadText = 'アップロード中..';

  private userSub;

  private uploadMessageId = null;

  constructor(
    private route: ActivatedRoute,
    private users: UsersService,
    private nzMessage: NzMessageService,
    public afAuth: AngularFireAuth) {
  }

  public onUpload(e) {
    if (!this.afAuth.app.auth().currentUser) {
      return;
    }
    const uid = this.afAuth.app.auth().currentUser.uid;
    if (this.route.snapshot.params.uid !== uid) {
      return;
    }
    this.uploadMessageId =
      this.nzMessage.loading(this.uploadText).messageId;
    this.file = e.file;
    const file = e.file.originFileObj;
    const filePath = `icons/${uid}`;
    const storageRef = firebase.storage().ref(filePath);
    const task = storageRef.put(file)
      .then(() => {
        this.nzMessage.remove(this.uploadMessageId);
      });
  }

  public ngOnInit() {
    if (!this.afAuth.app.auth().currentUser) {
      return;
    }
    const uid = this.route.snapshot.params.uid;
    this.userSub = this.users.getDoc({id: uid})
      .subscribe(({data}) => {
        const user = data.user as User;
        this.createdAt = user.createdAt;
        this.description = user.description;
        this.followeeCount = user.followeeCount;
        this.followerCount = user.followerCount;
        this.headerPhotoURL = user.headerPhotoURL;
        this.photoURL = user.photoURL;
        this.postCount = user.postCount;
      });
  }

  public ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
