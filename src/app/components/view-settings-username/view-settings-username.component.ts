import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { NzMessageService } from 'ng-zorro-antd';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap } from 'rxjs/operators';
import { LOGIN_ERROR, UPDATE_DATA_ERROR, UPDATE_DATA_LOADING, UPDATE_DATA_SUCCESS } from '../../constants/messages';

import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-view-settings-username',
  templateUrl: './view-settings-username.component.html',
  styleUrls: ['./view-settings-username.component.css']
})
export class ViewSettingsUsernameComponent implements OnInit, OnDestroy {
  // form states
  public formGroup: FormGroup;
  public loginFormGroup: FormGroup;

  // ui states
  public nzSize = 'large';
  public nzTitle = '重要な変更';
  public usernamePlaceHolder = 'username';
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

    this.formGroup.controls.newUsername.markAsDirty();

    if (!this.formGroup.valid) {
      this.isMutate = false;
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
      this.isQuery = false;
    } else {
      this.isNotFound = true;
    }
  }
}
