import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import { FunctionsService } from '../../services/functions.service';
import {
  ERROR_INVALID_USERNAME,
  ERROR_USERNAME_ALREADY_IN_USE,
  MSG_INPUT_EMAIL,
  USER_NOT_FOUND
} from '../../constants/login';

@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.css']
})
export class ViewLoginComponent implements OnInit {
  // forms
  public formGroup: FormGroup;

  // https
  public isMutate = false;

  // constants
  public nzSize = 'large';
  public usernamePlaceHolder = 'ユーザネーム';
  public passwordPlaceHolder = 'パスワード';

  public get emailError() {
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

  public get passwordError() {
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

  public get username() {
    return this.formGroup.controls.username;
  }

  public get password() {
    return this.formGroup.controls.password;
  }

  constructor(
    private afa: AngularFireAuth,
    private router: Router,
    private formBuilder: FormBuilder,
    private functionsService: FunctionsService) {
  }

  public onSignUp(event) {
    event.preventDefault();

    if (this.isMutate) {
      return;
    }

    this.isMutate = true;

    this.mutateSignUp();
  }

  public onSignIn(event) {
    event.preventDefault();

    if (this.isMutate) {
      return;
    }

    this.isMutate = true;

    this.mutateSignIn();
  }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  private mutateSignUp() {
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

  private mutateSignIn() {
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

  private mutateRestore() {
    const username = this.username.value;
    const password = this.password.value;
    const email = username + '@swimmy.io';

    this.functionsService
      .restoreUser({username, password})
      .subscribe(({valid, error}) => {
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

  private catchMutation() {
    this.router.navigate(['/']).catch((err) => {
      console.error(err);
    });
  }

  private catchErrorCode(code) {
    this.isMutate = false;
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/invalid-email':
      case 'auth/email-already-in-use':
      case 'auth/user-disabled':
        this.username.setErrors({[code]: true});
        break;
      case 'auth/wrong-password':
      case 'auth/too-many-requests':
      case 'auth/weak-password':
        this.password.setErrors({[code]: true});
        break;
    }
  }
}
