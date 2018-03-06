import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { NzMessageService } from 'ng-zorro-antd';

import { LOGOUT_ERROR, LOGOUT_SUCCESS } from '../../constants/messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.component.html',
  styleUrls: ['./view-settings.component.css']
})
export class ViewSettingsComponent implements OnInit, OnDestroy {
  // ui state
  public displayName = null;
  public photoURL = null;
  public isShowModal = false;
  public nzClosable = false;
  public nzOkText = 'ログアウト';
  public nzCancelText = 'キャンセル';

  // http
  public isQuery = true;
  public isNotFound = false;

  // subscription
  private authState$$ = null;

  constructor (
    private afAuth: AngularFireAuth,
    private message: NzMessageService,
    private router: Router) { }

  public onLogoutModal () {
    this.isShowModal = true;
  }

  public onCancelLogoutModal () {
    this.isShowModal = false;
  }

  public onLogout () {
    this.isShowModal = false;
    this.afAuth.auth.signOut().then(() => {
      return this.router.navigate(['/']);
    }).then(() => {
      this.message.success(LOGOUT_SUCCESS);
    }).catch(() => {
      this.message.error(LOGOUT_ERROR);
    });
  }

  ngOnInit () {
    this.authState$$ = this.afAuth.authState.subscribe((data) => {
      this.onAuthState(data);
    });
  }

  ngOnDestroy () {
    this.authState$$.unsubscribe();
  }

  private onAuthState (user) {
    if (user) {
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
    } else {
      this.isNotFound = true;
    }
    this.isQuery = false;
  }
}
