import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import { UsersService } from '../services/users.service';
import { User } from '../models/User';

@Component({
  selector: 'app-view-user-detail',
  templateUrl: './view-user-detail.component.html',
  styleUrls: ['./view-user-detail.component.css']
})
export class ViewUserDetailComponent implements OnInit, OnDestroy {
  public photoURL;

  private userSub;

  constructor(
    private route: ActivatedRoute,
    private users: UsersService,
    public afAuth: AngularFireAuth) {
  }

  public previewImage(e) {
    const uid = this.afAuth.app.auth().currentUser.uid;
    const file = e.target.files[0];
    const fileName = `${uid}`;
    const filePath = `icons/${fileName}`;
    const storageRef = firebase.storage().ref(filePath);
    const task = storageRef.put(file);
  }

  public ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const uid = params.get('uid');
      this.userSub = this.users.fetch(uid)
        .subscribe((user: User) => {
          this.photoURL = user.photoURL;
        });
    });
  }

  public ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
