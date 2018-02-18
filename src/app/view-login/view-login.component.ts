import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.css']
})
export class ViewLoginComponent implements OnInit {
  public formGroup: FormGroup;

  public isMutate = false;

  public get emailError() {
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

  private catchErrorCode(code) {
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

  public onSignUp(event) {
    event.preventDefault();

    if (this.isMutate) {
      return;
    }

    this.isMutate = true;

    const username = this.username.value;
    const password = this.password.value;
    const email = username + '@swimmy.io';
    this.functionsService.importUser({username, password})
      .then((res: any) => {
        if (res.exists || !res.uid) {
          this.catchErrorCode('auth/email-already-in-use');
          return;
        }
        return this.afa.auth.createUserWithEmailAndPassword(email, password);
      })
      .then(() => {
        this.isMutate = false;
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.isMutate = false;
      });
  }

  public onSignIn(event) {
    event.preventDefault();

    if (this.isMutate) {
      return;
    }

    this.isMutate = true;

    const username = this.username.value;
    const password = this.password.value;
    const email = username + '@swimmy.io';

    this.afa.auth.signInWithEmailAndPassword(email, password)
      .catch((err) => {
        this.functionsService.importUser({username, password})
          .then(({data}: any) => {
            if (data.exists && data.uid) {
              return this.afa.auth
                .createUserWithEmailAndPassword(email, password);
            } else {
              this.catchErrorCode(err.code);
            }
          })
          .then(() => {
            this.isMutate = false;
            this.router.navigate(['/']);
          })
          .catch((_err) => {
            this.isMutate = false;
          });
      });
  }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
