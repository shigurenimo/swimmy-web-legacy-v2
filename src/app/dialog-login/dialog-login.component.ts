import { Component, Inject } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})
export class DialogLoginComponent {
  public options: FormGroup;

  public username = new FormControl('', [Validators.required]);

  public password = new FormControl('', [Validators.required]);

  private inProgress = false;

  get emailError() {
    if (this.username.hasError('required')) {
      return 'ユーザネームを入力してください';
    }
    if (this.username.hasError('auth/invalid-email')) {
      return '無効な形式です';
    }
    if (this.username.hasError('auth/email-already-in-use')) {
      return '既に存在します';
    }
    return '';
  }

  get passwordError() {
    if (this.password.hasError('required')) {
      return 'パスワードを入力してください';
    }
    if (this.password.hasError('auth/wrong-password')) {
      return 'パスワードが間違っています';
    }
    if (this.password.hasError('auth/too-many-request')) {
      return '試行回数が多すぎます';
    }
    return '';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto'
    });
  }

  onSignUpClick() {
    if (this.inProgress) {
      return;
    }
    this.inProgress = true;
    const username = this.username.value;
    const password = this.password.value;
    const email = username + '@swimmy.io';
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .catch(err => {
        console.log(err);
        this.catchErrorCode(err.code);
        this.inProgress = false;
      });
  }

  onSignInClick() {
    if (this.inProgress) {
      return;
    }
    this.inProgress = true;
    const username = this.username.value;
    const password = this.password.value;
    const email = username + '@swimmy.io';
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch(err => {
        console.log(err);
        this.catchErrorCode(err.code);
        this.inProgress = false;
      });
  }

  catchErrorCode(code) {
    switch (code) {
      case 'auth/invalid-email':
        return this.username.setErrors({'auth/invalid-email': true});
      case 'auth/email-already-in-use':
        return this.username.setErrors({'auth/email-already-in-use': true});
      case 'auth/wrong-password':
        return this.password.setErrors({'auth/wrong-password': true});
      case 'auth/too-many-requests':
        return this.password.setErrors({'auth/too-many-requests': true});
    }
  }
}
