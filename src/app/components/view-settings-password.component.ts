import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { NzMessageService } from 'ng-zorro-antd';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap } from 'rxjs/operators';

import { UPDATE_DATA_SUCCESS, UPDATE_ERROR } from '../constants/messages';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-view-settings-password',
  template: `
    <app-header [goBack]='true'>
      <ng-template #title>
        パスワード
      </ng-template>
    </app-header>

    <div *ngIf='!isQuery && !isNotFound'>
      <div class='form'>
        <form nz-form [formGroup]='formGroup' (ngSubmit)='onMutate()'>
          <div nz-form-item>
            <div nz-form-label nz-col>
              <label>現在のパスワード</label>
            </div>
            <div>
              <nz-input
                formControlName='currentPassword'
                nzType='password'
                [nzSize]='nzSize'>
                <ng-template #prefix>
                  <i class='anticon anticon-key'></i>
                </ng-template>
              </nz-input>
              <div
                nz-form-explain
                *ngIf="password.dirty && password.hasError('auth/weak-password')"
              >
                パスワードが弱すぎます
              </div>
            </div>
            <p class='form-helper'>
              現在のパスワードを入力してください。
            </p>
          </div>
          <div class='down'>
            <i class='anticon anticon-down'></i>
          </div>
          <div nz-form-item>
            <div nz-form-label nz-col>
              <label nz-form-item-required>新しいパスワード</label>
            </div>
            <div nz-form-control nzHasFeedback>
              <nz-input
                formControlName='password'
                [nzPlaceHolder]='passwordPlaceHolder'
                nzType='password'
                [nzSize]='nzSize'>
                <ng-template #prefix>
                  <i class='anticon anticon-key'></i>
                </ng-template>
              </nz-input>
              <div
                nz-form-explain
                *ngIf="password.dirty && password.hasError('auth/weak-password')">
                パスワードが弱すぎます
              </div>
            </div>
            <p class='form-helper'>
              このパスワードでログインします。
            </p>
          </div>
          <div nz-row nzType='flex' nzJustify='end'>
          <span nz-col>
            <button nz-button [nzSize]='nzSize' (click)='onMutate()'>変更する</button>
          </span>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host > div {
      margin: 0 auto;
      max-width: 600px;
      padding: 8px;
    }

    .form {
      margin: 0 auto;
      padding-top: 40px;
      max-width: 280px;
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
export class ViewSettingsPasswordComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public nzSize = 'large';
  public passwordPlaceHolder = Math.random().toString(36).slice(-16);
  public isQuery = true;
  public isNotFound = false;
  public isMutate = false;

  private authState$$ = null;

  constructor (
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private message: NzMessageService) {
  }

  public get password () {
    return this.formGroup.controls.password;
  }

  public onMutate () {
    if (this.isMutate) { return; }

    this.isMutate = true;

    this.password.markAsDirty();

    if (!this.formGroup.valid) {
      this.isMutate = false;
      return;
    }

    const currentUser = this.afAuth.auth.currentUser;
    const { password } = this.formGroup.value;

    fromPromise(currentUser.updatePassword(password)).subscribe(() => {
      this.message.success(UPDATE_DATA_SUCCESS);
      this.resetFormGroup();
    }, (err) => {
      switch (err.code) {
        case 'auth/requires-recent-login':
          this.login();
          break;
        case 'auth/weak-password':
          this.password.setErrors({ [err.code]: true });
          this.isMutate = false;
          break;
        default:
      }
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

  private setFormGroup () {
    this.formGroup = this.formBuilder.group({
      currentPassword: [null, []],
      password: [null, [Validators.required]]
    });
  }

  private resetFormGroup () {
    this.formGroup.reset({ currentPassword: '', password: '' });
  }

  private login () {
    const currentUser = this.afAuth.auth.currentUser;
    const { email } = currentUser;
    const { currentPassword, password } = this.formGroup.value;

    const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);

    fromPromise(currentUser.reauthenticateWithCredential(credential)).pipe(
      mergeMap(() => {
        return fromPromise(currentUser.updatePassword(password));
      })
    ).subscribe(() => {
      this.message.success(UPDATE_DATA_SUCCESS);
      this.resetFormGroup();
      this.isMutate = false;
    }, () => {
      this.message.error(UPDATE_ERROR);
      this.isMutate = false;
    });
  }

  private onAuthState (user) {
    if (user) {
      this.setFormGroup();
      this.isQuery = false;
    } else {
      this.isNotFound = true;
    }
  }
}
