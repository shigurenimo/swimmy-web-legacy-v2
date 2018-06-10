import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { BrowserService } from '../../../../services/browser.service';

@Component({
  selector: 'app-view-home',
  template: `
    <form [formGroup]="formGroup">
      <h2 mdc-typography headline6>ユーザネーム</h2>
      <div
        mdc-text-field
        withTrailingIcon
        fullwidth
        class="mdc-text-field--padding"
      >
        <input
          mdc-text-field-input
          type="text"
          autocomplete="on"
          formControlName='username'
          placeholder="username"
          name="username"
        >
        <div mdc-line-ripple></div>
      </div>

      <ng-container *ngIf="isError('username')">
        <ng-container *ngIf="hasError('username', 'required')">
          <p sw-text-field-error class="mdc-text-field--padding">ユーザネームが必要です</p>
        </ng-container>
        <ng-container *ngIf="hasError('username', 'auth/invalid-email')">
          <p sw-text-field-error class="mdc-text-field--padding">ユーザネームが正しくありません。</p>
        </ng-container>
        <ng-container *ngIf="hasError('username', 'auth/email-already-in-use')">
          <p sw-text-field-error class="mdc-text-field--padding">このユーザネームは既に使われています。</p>
        </ng-container>
        <ng-container *ngIf="hasError('username', 'auth/user-not-found')">
          <p sw-text-field-error class="mdc-text-field--padding">ユーザが見つかりません。</p>
        </ng-container>
        <ng-container *ngIf="hasError('username', 'auth/user-disabled')">
          <p sw-text-field-error class="mdc-text-field--padding">このユーザは現在使用できません。</p>
        </ng-container>
      </ng-container>

      <h2 mdc-typography headline6>パスワード</h2>
      <div
        mdc-text-field
        withTrailingIcon
        fullwidth
        class="mdc-text-field--padding"
      >
        <input
          mdc-text-field-input
          autocomplete="on"
          type="password"
          name="password"
          formControlName='password'
          placeholder="password"
        >
        <div mdc-line-ripple></div>
      </div>

      <ng-container *ngIf="isError('password')">
        <ng-container *ngIf="hasError('password', 'required')">
          <p sw-text-field-error class="mdc-text-field--padding">パスワードが必要です。</p>
        </ng-container>
        <ng-container *ngIf="hasError('password', 'auth/wrong-password')">
          <p sw-text-field-error class="mdc-text-field--padding">パスワードが間違っています。</p>
        </ng-container>
        <ng-container *ngIf="hasError('password', 'auth/too-many-request')">
          <p sw-text-field-error class="mdc-text-field--padding">リクエストが多すぎます。</p>
        </ng-container>
        <ng-container *ngIf="hasError('password', 'auth/weak-password')">
          <p sw-text-field-error class="mdc-text-field--padding">パスワードが弱すぎます</p>
        </ng-container>
      </ng-container>

      <div class='block-form-submut'>
        <button mdc-button raised [disabled]='isLoading' (click)="onSignIn($event)">
          <span>ログイン</span>
        </button>
        <button mdc-button raised [disabled]='isLoading' (click)="onSignUp($event)">
          <span>登録</span>
        </button>
      </div>
    </form>
  `,
  styleUrls: ['view-home.component.scss'],
})
export class ViewHomeComponent implements OnInit {
  public formGroup: FormGroup;
  public isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public get username() {
    return this.formGroup.controls.username;
  }

  public get password() {
    return this.formGroup.controls.password;
  }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  public isError(name: string): boolean {
    const input = this.formGroup.get(name);
    return input.invalid && (input.dirty || input.touched);
  }

  public hasError(name: string, errorCode: string): boolean {
    return this.formGroup.get(name).hasError(errorCode);
  }

  public onSignUp(event) {
    event.preventDefault();

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.mutateSignUp();
  }

  public onSignIn(event) {
    event.preventDefault();

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.mutateSignIn();
  }

  private mutateSignUp() {
    const username = this.username.value;
    const password = this.password.value;
    const email = username + '@swimmy.io';

    this.authService.auth
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

    this.authService.auth
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

    const restoreUser$ = this.authService.restoreUser({username, password});

    restoreUser$.subscribe((data) => {
      const {valid, error} = data as any;
      if (!valid) {
        this.catchErrorCode(error);
        return;
      }
      this.authService.auth.signInWithEmailAndPassword(email, password)
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
    this.isLoading = false;
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
