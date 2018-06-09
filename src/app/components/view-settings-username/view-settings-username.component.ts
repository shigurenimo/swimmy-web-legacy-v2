import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import * as firebase from 'firebase/app';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { LOGIN_ERROR, UPDATE_DATA_ERROR, UPDATE_DATA_SUCCESS } from '../../constants/messages';
import { DialogComponent } from '../../modules/mdc/components/dialog/dialog.component';
import { SnackbarComponent } from '../../modules/mdc/components/snackbar/snackbar.component';
import { AuthService } from '../../services/auth.service';
import { BrowserService } from '../../services/browser.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-view-settings-username',
  template: `
    <ng-container *ngIf='!isLoadingQuery && !isNotFound'>
      <form [formGroup]='formGroup' (ngSubmit)='onMutate()' class='block-form'>
        <h2 mdc-typography headline6>現在のユーザネーム</h2>
        <div
          mdc-text-field
          withTrailingIcon
          fullwidth
          class='mdc-text-field--padding'
        >
          <input mdc-text-field-input formControlName='currentUsername' placeholder='username' [readonly]='true'>
          <div mdc-line-ripple></div>
        </div>

        <h2 mdc-typography headline6>新しいユーザネーム</h2>
        <div
          mdc-text-field
          withTrailingIcon
          fullwidth
          class='mdc-text-field--padding'
        >
          <input mdc-text-field-input formControlName='newUsername' placeholder='username?'>
          <i mdc-text-field-icon role="button">edit</i>
          <div mdc-line-ripple></div>
        </div>

        <div class='block-form-submut'>
          <button mdc-button raised [disabled]='isDisabled' (click)="onMutate()">
            <span>変更する</span>
          </button>
        </div>
      </form>
    </ng-container>

    <aside mdc-dialog>
      <div mdc-dialog-surface>
        <header mdc-dialog-header>
          <h2 mdc-dialog-header-title>ログインが必要です</h2>
        </header>
        <section mdc-dialog-body>
          <form [formGroup]='loginFormGroup' (ngSubmit)='onLogin()'>
            <div
              mdc-text-field
              withTrailingIcon
              fullwidth
              class='mdc-text-field--padding'
            >
              <input mdc-text-field-input formControlName='username' placeholder='ユーザネーム' [readonly]='true'>
              <div mdc-line-ripple></div>
            </div>
            <div
              mdc-text-field
              withTrailingIcon
              fullwidth
              class='mdc-text-field--padding'
            >
              <input mdc-text-field-input formControlName='password' placeholder='パスワード' [readonly]='true'>
              <div mdc-line-ripple></div>
            </div>
          </form>
        </section>
        <footer mdc-dialog-footer>
          <button mdc-dialog-footer-button accept (click)='onLogin()'>ログイン</button>
        </footer>
      </div>
      <div mdc-dialog-backdrop></div>
    </aside>

    <div mdc-snackbar align-start>
      <div mdc-snackbar-text></div>
      <div mdc-snackbar-action-wrapper>
        <button mdc-snackbar-action-button></button>
      </div>
    </div>
  `,
  styleUrls: ['view-settings-username.component.scss'],
})
export class ViewSettingsUsernameComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public loginFormGroup: FormGroup;
  public isNotFound = false;
  public isLoadingQuery = true;
  public isLoadingMutatation = false;
  public isLoadingLogin = false;

  private authState$$ = null;

  @ViewChild(DialogComponent)
  private dialogComponent: DialogComponent;

  @ViewChild(SnackbarComponent)
  private snackbarComponent: SnackbarComponent;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.authState$$ = this.authService.authState().subscribe((data) => {
      this.onAuthState(data);
    });
    this.setForm();
    this.setLoginForm();
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  ngOnDestroy() {
    this.authState$$.unsubscribe();
  }

  public get isDisabled() {
    return !this.formGroup.get('newUsername').value;
  }

  public onMutate() {
    if (this.isLoadingMutatation) {
      return;
    }

    this.isLoadingMutatation = true;

    this.formGroup.controls.newUsername.markAsDirty();

    if (!this.formGroup.valid) {
      this.isLoadingMutatation = false;
      return;
    }

    const currentUser = this.authService.currentUser;
    const {newUsername} = this.formGroup.value;

    const newEmail = `${newUsername}@swimmy.io`;
    const email$ = from(currentUser.updateEmail(newEmail));
    const user$ = mergeMap(() => {
      return this.usersService._updateUser(currentUser.uid, {
        username: newUsername,
      });
    });

    return email$.pipe(user$).subscribe(() => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
      this.resetFormGroup();
      this.isLoadingMutatation = false;
    }, (err) => {
      if (err.code === 'auth/requires-recent-login') {
        this.dialogComponent.dialog.show();
      } else {
        this.snackbarComponent.snackbar.show({message: UPDATE_DATA_ERROR});
      }
      this.isLoadingMutatation = false;
    });
  }

  public onLogin() {
    if (this.isLoadingLogin) {
      return;
    }

    this.dialogComponent.dialog.listen('MDCDialog:accept', () => {
      this.isLoadingLogin = false;
    });

    this.dialogComponent.dialog.listen('MDCDialog:cancel', () => {
      this.isLoadingLogin = false;
    });

    this.isLoadingLogin = true;

    this.loginFormGroup.get('username').markAsDirty();

    if (!this.loginFormGroup.valid) {
      return;
    }

    const currentUser = this.authService.currentUser;
    const {username, password} = this.loginFormGroup.value;
    const {newUsername} = this.formGroup.value;

    const email = `${username}@swimmy.io`;
    const newEmail = `${newUsername}@swimmy.io`;

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    const username$ = mergeMap(() => {
      return from(currentUser.updateEmail(newEmail));
    });

    const credential$ = from(currentUser.reauthenticateWithCredential(credential));

    const user$ = mergeMap(() => {
      return this.usersService._updateUser(currentUser.uid, {
        username: newUsername,
      });
    });

    credential$.pipe(username$).pipe(user$).subscribe(() => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
      this.dialogComponent.dialog.close();
      this.resetFormGroup();
      this.isLoadingLogin = false;
    }, (err) => {
      this.snackbarComponent.snackbar.show({message: LOGIN_ERROR});
      this.isLoadingLogin = false;
    });
  }

  private setLoginForm() {
    const user = this.authService.currentUser;

    const username = user.email.replace('@swimmy.io', '');

    this.loginFormGroup = this.formBuilder.group({
      username: [username, []],
      password: [null, [Validators.required]],
    });
  }

  private setForm() {
    const user = this.authService.currentUser;

    const username = user.email.replace('@swimmy.io', '');

    this.formGroup = this.formBuilder.group({
      currentUsername: [username, [Validators.max(10)]],
      newUsername: [null, [Validators.required, Validators.max(10)]],
    });
  }

  private resetFormGroup() {
    const user = this.authService.currentUser;

    const username = user.email.replace('@swimmy.io', '');

    this.formGroup.reset({currentUsername: username, newUsername: ''});
  }

  private onAuthState(user) {
    if (user) {
      this.isLoadingQuery = false;
    } else {
      this.isNotFound = true;
    }
  }
}
