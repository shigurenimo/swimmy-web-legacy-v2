import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { NzMessageService } from 'ng-zorro-antd';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap } from 'rxjs/operators';
import { LOGIN_ERROR, UPDATE_DATA_ERROR, UPDATE_DATA_LOADING, UPDATE_DATA_SUCCESS } from '../constants/messages';

import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-view-settings-username',
  template: `
    <app-header [goBack]='true'>
      <ng-template #title>
        識別子の更新
      </ng-template>
    </app-header>

    <div *ngIf='!isLoadingQuery && !isNotFound'>
      <div class='description'>
        <p>
          識別子はログインやプロフィールのURLに使用されます。<br />
          他のユーザと同じ識別子は使用できません。
        </p>
      </div>
      <div class='form'>
        <form nz-form [formGroup]='formGroup' (ngSubmit)='onMutate()'>
          <nz-form-item>
            <nz-form-label>現在の識別子</nz-form-label>
            <nz-input-group nzPrefixIcon="anticon anticon-code-o">
              <input
                nz-input
                formControlName='currentUsername'
                [readonly]='true'
              >
            </nz-input-group>
          </nz-form-item>
          <div class='down'>
            <i class='anticon anticon-down'></i>
          </div>
          <nz-form-item>
            <nz-form-label nzRequired>新しい識別子</nz-form-label>
            <nz-form-control nzHasFeedback>
              <nz-input-group nzPrefixIcon="anticon anticon-code-o">
                <input
                  nz-input
                  formControlName='newUsername'
                  placeholder='username'
                >
              </nz-input-group>
            </nz-form-control>
            <p class='form-helper'>
              この識別子でログインします。
            </p>
          </nz-form-item>
          <nz-form-item nz-row nzType='flex' nzJustify='end'>
            <span nz-col>
              <button nz-button (click)='onMutate()'>変更する</button>
            </span>
          </nz-form-item>
        </form>
      </div>
    </div>

    <nz-modal
      *ngIf='loginFormGroup'
      [nzVisible]='isShowModal'
      nzTitle='重要な変更'
      [nzContent]='content'
      [nzFooter]='footer'
      (nzOnCancel)='onCancelLogin()'>
      <ng-template #content>
        <form nz-form [formGroup]='loginFormGroup' (ngSubmit)='onLogin()'>
          <nz-form-item>
            <nz-form-label nzRequired>ユーザネーム</nz-form-label>
            <nz-form-control>
              <nz-input-group nzPrefixIcon="anticon anticon-mail">
                <input nz-input formControlName='username' [readonly]='true'>
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzRequired>パスワード</nz-form-label>
            <nz-form-control>
              <nz-input-group nzPrefixIcon="anticon anticon-key">
                <input nz-input formControlName='password' type='password'>
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>
        </form>
      </ng-template>
      <ng-template #footer>
        <div>
          <button nz-button (click)='onLogin()'>ログイン</button>
        </div>
      </ng-template>
    </nz-modal>
  `,
  styles: [`
    :host > div {
      margin: 0 auto;
      max-width: 400px;
      padding: 8px;
    }

    .description {
      margin: 0 auto;
      padding-top: 40px;
    }

    .form {
      margin: 0 auto;
      padding-top: 40px;
    }

    .form-helper {
      padding-top: 8px;
      opacity: 0.8;
    }

    .down {
      padding: 0 0 24px;
      text-align: center;
      font-size: 14px;
    }
  `]
})
export class ViewSettingsUsernameComponent implements OnInit, OnDestroy {
  private authState$$ = null;

  public formGroup: FormGroup;
  public loginFormGroup: FormGroup;
  public isShowModal = false;
  public isNotFound = false;
  public isLoadingQuery = true;
  public isLoadingMutatation = false;
  public isLoadingLogin = false;

  constructor (
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private message: NzMessageService) {
  }

  private setLoginForm () {
    const user = this.afAuth.auth.currentUser;

    const username = user.email.replace('@swimmy.io', '');

    this.loginFormGroup = this.formBuilder.group({
      username: [username, []],
      password: [null, [Validators.required]]
    });
  }

  private setFormGroup () {
    const user = this.afAuth.auth.currentUser;

    const username = user.email.replace('@swimmy.io', '');

    this.formGroup = this.formBuilder.group({
      currentUsername: [username, [Validators.max(10)]],
      newUsername: [null, [Validators.required, Validators.max(10)]]
    });
  }

  private resetFormGroup () {
    const user = this.afAuth.auth.currentUser;

    const username = user.email.replace('@swimmy.io', '');

    this.formGroup.reset({ currentUsername: username, newUsername: '' });
  }

  private onAuthState (user) {
    if (user) {
      this.setFormGroup();
      this.isLoadingQuery = false;
    } else {
      this.isNotFound = true;
    }
  }

  public onMutate () {
    if (this.isLoadingMutatation) { return; }

    this.isLoadingMutatation = true;

    this.formGroup.controls.newUsername.markAsDirty();

    if (!this.formGroup.valid) {
      this.isLoadingMutatation = false;
      return;
    }

    const currentUser = this.afAuth.auth.currentUser;
    const { newUsername } = this.formGroup.value;
    const messageId = this.message.loading(UPDATE_DATA_LOADING).messageId;

    const newEmail = `${newUsername}@swimmy.io`;

    const email$ = fromPromise(currentUser.updateEmail(newEmail));

    const user$ = mergeMap(() => {
      return this.usersService.updateUser(currentUser.uid, {
        username: newUsername
      });
    });

    return email$.pipe(user$).subscribe(() => {
      this.message.remove(messageId);
      this.message.success(UPDATE_DATA_SUCCESS);
      this.resetFormGroup();
      this.isLoadingMutatation = false;
    }, (err) => {
      if (err.code === 'auth/requires-recent-login') {
        this.setLoginForm();
        this.isShowModal = true;
      } else {
        this.message.error(UPDATE_DATA_ERROR);
      }
      this.message.remove(messageId);
      this.isLoadingMutatation = false;
    });
  }

  public onLogin () {
    if (this.isLoadingLogin) { return; }

    this.isLoadingLogin = true;

    this.loginFormGroup.controls.username.markAsDirty();

    if (!this.loginFormGroup.valid) { return; }

    const currentUser = this.afAuth.auth.currentUser;
    const { username, password } = this.loginFormGroup.value;
    const { newUsername } = this.formGroup.value;

    const email = `${username}@swimmy.io`;
    const newEmail = `${newUsername}@swimmy.io`;

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    const username$ = mergeMap(() => {
      return fromPromise(currentUser.updateEmail(newEmail));
    });

    const credential$ = fromPromise(currentUser.reauthenticateWithCredential(credential));

    const user$ = mergeMap(() => {
      return this.usersService.updateUser(currentUser.uid, {
        username: newUsername
      });
    });

    credential$.pipe(username$).pipe(user$).subscribe(() => {
      this.message.success(UPDATE_DATA_SUCCESS);
      this.resetFormGroup();
      this.isShowModal = false;
      this.isLoadingLogin = false;
    }, (err) => {
      this.message.error(LOGIN_ERROR);
      this.isLoadingLogin = false;
    });
  }

  public onCancelLogin (e) {
    this.isShowModal = false;
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
