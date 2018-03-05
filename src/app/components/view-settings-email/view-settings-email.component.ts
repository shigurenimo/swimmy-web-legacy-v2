import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { UsersService } from '../../services/users.service';
import { LOGIN_ERROR, UPDATE_DATA_ERROR, UPDATE_DATA_LOADING, UPDATE_DATA_SUCCESS } from '../../constants/messages';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-view-settings-email',
  templateUrl: './view-settings-email.component.html',
  styleUrls: ['./view-settings-email.component.css']
})
export class ViewSettingsEmailComponent implements OnInit, OnDestroy {
  // form states
  public formGroup: FormGroup;
  public loginFormGroup: FormGroup;

  // ui states
  public nzSize = 'large';
  public nzTitle = '重要な変更';
  public emailPlaceHolder = 'example@pwao.io';
  public isShowModal = false;

  // http
  public isQuery = true;
  public isNotFound = false;
  public isMutate = false;
  public isMutateLogin = false;

  // subscription
  private authState$$ = null;

  constructor (
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private message: NzMessageService) {
  }

  public onMutate () {
    if (this.isMutate) { return; }

    this.isMutate = true;

    this.formGroup.controls.newEmail.markAsDirty();

    if (!this.formGroup.valid) {
      this.isMutate = false;
      return;
    }

    const currentUser = this.afAuth.auth.currentUser;
    const { newEmail } = this.formGroup.value;
    const messageId = this.message.loading(UPDATE_DATA_LOADING).messageId;

    return fromPromise(currentUser.updateEmail(newEmail)).subscribe(() => {
      this.message.remove(messageId);
      this.message.success(UPDATE_DATA_SUCCESS);
      this.resetFormGroup();
      this.isMutate = false;
    }, (err) => {
      if (err.code === 'auth/requires-recent-login') {
        this.setLoginForm();
        this.isShowModal = true;
      } else {
        this.message.error(UPDATE_DATA_ERROR);
      }
      this.message.remove(messageId);
      this.isMutate = false;
    });
  }

  public onLogin () {
    if (this.isMutateLogin) { return; }

    this.isMutateLogin = true;

    this.loginFormGroup.controls.email.markAsDirty();

    if (!this.loginFormGroup.valid) { return; }

    const currentUser = this.afAuth.auth.currentUser;
    const { email, password } = this.loginFormGroup.value;
    const { newEmail } = this.formGroup.value;

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    fromPromise(currentUser.reauthenticateWithCredential(credential)).pipe(
      mergeMap(() => {
        return fromPromise(currentUser.updateEmail(newEmail));
      })
    ).subscribe(() => {
      this.message.success(UPDATE_DATA_SUCCESS);
      this.resetFormGroup();
      this.isShowModal = false;
      this.isMutateLogin = false;
    }, (err) => {
      this.message.error(LOGIN_ERROR);
      this.isMutateLogin = false;
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

  private setLoginForm () {
    const user = this.afAuth.auth.currentUser;

    this.loginFormGroup = this.formBuilder.group({
      email: [user.email, []],
      password: [null, [Validators.required]]
    });
  }

  private setFormGroup () {
    const user = this.afAuth.auth.currentUser;

    this.formGroup = this.formBuilder.group({
      currentEmail: [user.email, [Validators.email]],
      newEmail: [null, [Validators.required, Validators.email]]
    });
  }

  private resetFormGroup () {
    const user = this.afAuth.auth.currentUser;

    this.formGroup.reset({ currentEmail: user.email, newEmail: '' });
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
