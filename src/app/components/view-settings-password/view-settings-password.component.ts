import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { NzMessageService } from 'ng-zorro-antd';

import { UsersService } from '../../services/users.service';
import { UPDATE_DATA_SUCCESS, UPDATE_ERROR } from '../../constants/messages';

@Component({
  selector: 'app-view-settings-password',
  templateUrl: './view-settings-password.component.html',
  styleUrls: ['./view-settings-password.component.css']
})
export class ViewSettingsPasswordComponent implements OnInit, OnDestroy {
  // form state
  public formGroup: FormGroup;

  // ui state
  public nzSize = 'large';
  public passwordPlaceHolder = Math.random().toString(36).slice(-16);

  // http
  public isQuery = true;
  public isNotFound = false;

  // state
  public isMutate = false;

  // subscription
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
