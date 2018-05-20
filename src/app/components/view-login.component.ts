import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import {
  ERROR_INVALID_USERNAME, ERROR_USERNAME_ALREADY_IN_USE, MSG_INPUT_EMAIL, USER_NOT_FOUND
} from '../constants/login';

import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-view-login',
  template: `
    <app-header></app-header>

    <div>
      <div class="title">
        <h1>S<span class="line">/</span>w</h1>
      </div>
      <div class="form">
        <form nz-form [formGroup]="formGroup">
          <nz-form-item>
            <nz-form-control nzHasFeedback>
              <nz-input-group nzPrefixIcon="anticon anticon-user">
                <input
                  nz-input
                  formControlName="username"
                  placeholder="ユーザネーム">
              </nz-input-group>
              <nz-form-explain *ngIf="emailError">{{emailError}}</nz-form-explain>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzHasFeedback>
              <nz-input-group nzPrefixIcon="anticon anticon-lock">
                <input
                  nz-input
                  formControlName="password"
                  type="password"
                  placeholder="パスワード">
              </nz-input-group>
              <nz-form-explain *ngIf="passwordError">{{passwordError}}</nz-form-explain>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control>
              <div nz-row nzType="flex" nzAlign="middle" nzGutter="8" nzJustify="end">
                <span nz-col>
                  <button nz-button [disabled]="isLoading" (click)="onSignUp($event)">登録</button>
                </span>
                <span class="or">or</span>
                <span nz-col>
                  <button nz-button [disabled]="isLoading" (click)="onSignIn($event)">ログイン</button>
                </span>
              </div>
            </nz-form-control>
          </nz-form-item>
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

    .title {
      padding-top: 80px;
    }

    .title h1 {
      text-align: center;
      letter-spacing: 4px;
      color: #108ee9;
    }

    .title .line {
      color: gray;
    }

    .form {
      margin: 0 auto;
      padding-top: 40px;
      max-width: 280px;
    }

    .or {
      letter-spacing: 1px;
      padding: 0 5px;
    }
  `]
})
export class ViewLoginComponent implements OnInit {
  public formGroup: FormGroup;
  public isLoading = false;

  constructor (
    private afa: AngularFireAuth,
    private router: Router,
    private formBuilder: FormBuilder,
    private functionsService: FunctionsService) {
  }

  private mutateSignUp () {
    const username = this.username.value;
    const password = this.password.value;
    const email = username + '@swimmy.io';

    this.afa.auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.catchMutation();
      })
      .catch((err) => {
        this.catchErrorCode(err.code);
      });
  }

  private mutateSignIn () {
    const username = this.username.value;
    const password = this.password.value;
    const email = username + '@swimmy.io';

    this.afa.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.catchMutation();
      })
      .catch((err) => {
        if (err.code === 'auth/user-disabled') {
          this.mutateRestore();
        } else {
          this.catchErrorCode(err.code);
        }
      });
  }

  private mutateRestore () {
    const username = this.username.value;
    const password = this.password.value;
    const email = username + '@swimmy.io';

    this.functionsService
      .restoreUser({ username, password })
      .subscribe(({ valid, error }) => {
        if (!valid) {
          this.catchErrorCode(error);
          return;
        }
        this.afa.auth.signInWithEmailAndPassword(email, password)
          .then(() => {
            this.catchMutation();
          })
          .catch((err) => {
            this.catchErrorCode(err.code);
          });
      });
  }

  private catchMutation () {
    this.router.navigate(['/']).catch((err) => {
      console.error(err);
    });
  }

  private catchErrorCode (code) {
    this.isLoading = false;
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/invalid-email':
      case 'auth/email-already-in-use':
      case 'auth/user-disabled':
        this.username.setErrors({ [code]: true });
        break;
      case 'auth/wrong-password':
      case 'auth/too-many-requests':
      case 'auth/weak-password':
        this.password.setErrors({ [code]: true });
        break;
    }
  }

  public get emailError () {
    if (this.username.hasError('required')) {
      return MSG_INPUT_EMAIL;
    }
    if (this.username.hasError('auth/invalid-email')) {
      return ERROR_INVALID_USERNAME;
    }
    if (this.username.hasError('auth/email-already-in-use')) {
      return ERROR_USERNAME_ALREADY_IN_USE;
    }
    if (this.username.hasError('auth/user-not-found')) {
      return USER_NOT_FOUND;
    }
    if (this.username.hasError('auth/user-disabled')) {
      return 'このユーザは現在使用できません';
    }
    return '';
  }

  public get passwordError () {
    if (this.password.hasError('required')) {
      return 'パスワードを入力してください';
    }
    if (this.password.hasError('auth/wrong-password')) {
      return 'パスワードが間違っています';
    }
    if (this.password.hasError('auth/too-many-request')) {
      return '試行回数が多すぎます';
    }
    if (this.password.hasError('auth/weak-password')) {
      return 'パスワードが弱すぎます';
    }
    return '';
  }

  public get username () {
    return this.formGroup.controls.username;
  }

  public get password () {
    return this.formGroup.controls.password;
  }

  public onSignUp (event) {
    event.preventDefault();

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.mutateSignUp();
  }

  public onSignIn (event) {
    event.preventDefault();

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.mutateSignIn();
  }

  public ngOnInit () {
    this.formGroup = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
