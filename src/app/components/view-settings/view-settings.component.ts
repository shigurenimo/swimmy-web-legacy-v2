import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { NzMessageService } from 'ng-zorro-antd';

import { LOGOUT_ERROR, LOGOUT_SUCCESS } from '../../constants/messages';

@Component({
  selector: 'app-view-settings',
  template: `
    <app-header></app-header>

    <div>
      <div *ngIf='!isLoadingQuery && isNotFound'>
        <p>ログインが必要です</p>
      </div>
      <ng-container *ngIf='!isLoadingQuery && !isNotFound'>
        <div class='profile' nz-row nzType='flex' nzGutter='16' nzAlign='middle'>
          <span nz-col>
            <nz-avatar class='icon' nzText='?' [nzSrc]='photoURL|resize'></nz-avatar>
          </span>
          <h2 nz-col>Hi, {{displayName}}</h2>
        </div>
        <ul class='menu'>
          <li nz-row nzGutter='8' routerLink='/settings/profile'>
            <i nz-col class='anticon anticon-user'></i>
            <span nz-col>プロフィール</span>
          </li>
          <li nz-row nzGutter='8' routerLink='/settings/username'>
            <i nz-col class='anticon anticon-code-o'></i>
            <span nz-col>識別子</span>
          </li>
          <li nz-row nzGutter='8' routerLink='/settings/password'>
            <i nz-col class='anticon anticon-key'></i>
            <span nz-col>パスワード</span>
          </li>
          <li nz-row nzGutter='8' (click)='onLogoutModal()'>
            <i nz-col class='anticon anticon-poweroff'></i>
            <span nz-col>ログアウト</span>
          </li>
        </ul>
      </ng-container>
    </div>

    <nz-modal
      [nzVisible]='isShowModal'
      [nzContent]='content'
      [nzClosable]='false'
      nzOkText='ログアウト'
      nzCancelText='キャンセル'
      (nzOnOk)='onLogout()'
      (nzOnCancel)='onCancelLogoutModal()'>
      <ng-template #content>
        <p>ログアウトしてもいいですか？</p>
      </ng-template>
    </nz-modal>
  `,
  styleUrls: ['view-settings.component.scss']
})
export class ViewSettingsComponent implements OnInit, OnDestroy {
  private authState$$ = null;

  public displayName = null;
  public photoURL = null;
  public isShowModal = false;
  public isLoadingQuery = true;
  public isNotFound = false;

  constructor (
    private afAuth: AngularFireAuth,
    private message: NzMessageService,
    private router: Router
  ) {}

  private onAuthState (user) {
    if (user) {
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
    } else {
      this.isNotFound = true;
    }
    this.isLoadingQuery = false;
  }

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
}
