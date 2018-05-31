import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { NzMessageService } from 'ng-zorro-antd';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap } from 'rxjs/operators';

import { UPDATE_DATA_SUCCESS, UPDATE_ERROR } from '../../constants/messages';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-view-settings-password',
  template: `
    <app-header [goBack]='true'>
      <ng-template #title>
        パスワード
      </ng-template>
    </app-header>

    <div *ngIf='!isLoadingQuery && !isNotFound'>
      <div class='form'>
        <form nz-form [formGroup]='formGroup' (ngSubmit)='onMutate()'>
          <nz-form-item>
            <nz-form-label>現在のパスワード</nz-form-label>
            <nz-input-group nzPrefixIcon="anticon anticon-key">
              <input
                nz-input
                formControlName='currentPassword'
                nzType='password'>
            </nz-input-group>
            <nz-form-explain *ngIf="password.dirty && password.hasError('auth/weak-password')">
              パスワードが弱すぎます
            </nz-form-explain>
            <p class='form-helper'>
              現在のパスワードを入力してください。
            </p>
          </nz-form-item>
          <div class='down'>
            <i class='anticon anticon-down'></i>
          </div>
          <nz-form-item>
            <nz-form-label nzRequired>新しいパスワード</nz-form-label>
            <nz-form-control nzHasFeedback>
              <nz-input-group nzPrefixIcon="anticon anticon-key">
                <input
                  nz-input
                  formControlName='password'
                  [placeholder]='passwordPlaceholder'
                  nzType='password'>
              </nz-input-group>
              <nz-form-explain *ngIf="password.dirty && password.hasError('auth/weak-password')">
                パスワードが弱すぎます
              </nz-form-explain>
            </nz-form-control>
            <p class='form-helper'>
              このパスワードでログインします。
            </p>
          </nz-form-item>
          <div nz-row nzType='flex' nzJustify='end'>
            <span nz-col>
              <button nz-button (click)='onMutate()'>変更する</button>
            </span>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['view-settings-password.component.scss']
})
export class ViewSettingsPasswordComponent implements OnInit, OnDestroy {
  private authState$$ = null;

  public formGroup: FormGroup;
  public passwordPlaceholder = Math.random().toString(36).slice(-16);
  public isLoadingQuery = true;
  public isNotFound = false;
  public isLoadingMutatation = false;

  constructor (
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private message: NzMessageService) {
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
      this.isLoadingMutatation = false;
    }, () => {
      this.message.error(UPDATE_ERROR);
      this.isLoadingMutatation = false;
    });
  }

  private onAuthState (user) {
    if (user) {
      this.setFormGroup();
      this.isLoadingQuery = false;
    } else {
      this.isNotFound = true;
    }
  }

  public get password () {
    return this.formGroup.controls.password;
  }

  public onMutate () {
    if (this.isLoadingMutatation) { return; }

    this.isLoadingMutatation = true;

    this.password.markAsDirty();

    if (!this.formGroup.valid) {
      this.isLoadingMutatation = false;
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
          this.isLoadingMutatation = false;
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
}
