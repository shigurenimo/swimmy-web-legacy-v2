import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import * as firebase from 'firebase/app';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap } from 'rxjs/operators';

import { UPDATE_DATA_SUCCESS, UPDATE_ERROR } from '../../constants/messages';
import { SnackbarComponent } from '../../modules/mdc/components/snackbar/snackbar.component';
import { AuthService } from '../../services/auth.service';
import { BrowserService } from '../../services/browser.service';

@Component({
  selector: 'app-view-settings-password',
  template: `
    <ng-container *ngIf='!isLoadingQuery && !isNotFound'>
      <form [formGroup]='formGroup' (ngSubmit)='onMutate()'>
        <h2 mdc-typography headline6>現在のパスワード</h2>
        <div
          mdc-text-field
          withTrailingIcon
          fullwidth
          class="mdc-text-field--padding"
        >
          <input mdc-text-field-input type="password" formControlName='currentPassword'>
          <div mdc-line-ripple></div>
        </div>

        <h2 mdc-typography headline6>新しいパスワード</h2>
        <div
          mdc-text-field
          withTrailingIcon
          fullwidth
          class="mdc-text-field--padding"
        >
          <input
            mdc-text-field-input
            type="password"
            formControlName="password"
            [placeholder]="passwordPlaceholder"
          >
          <div mdc-line-ripple></div>
        </div>

        <ng-container *ngIf="isError('password')">
          <ng-container *ngIf="hasError('password', 'auth/weak-password')">
            <p sw-text-field-error class="mdc-text-field--padding">パスワードが弱すぎます</p>
          </ng-container>
        </ng-container>

        <div class='block-form-submut'>
          <button mdc-button raised [disabled]='isDisabled' (click)="onMutate()">
            <span>変更する</span>
          </button>
        </div>
      </form>
    </ng-container>

    <div mdc-snackbar align-start>
      <div mdc-snackbar-text></div>
      <div mdc-snackbar-action-wrapper>
        <button mdc-snackbar-action-button></button>
      </div>
    </div>
  `,
  styleUrls: ['view-settings-password.component.scss'],
})
export class ViewSettingsPasswordComponent implements OnInit, OnDestroy {
  private authState$$ = null;

  public formGroup: FormGroup;
  public passwordPlaceholder = Math.random().toString(36).slice(-16);
  public isLoadingQuery = true;
  public isNotFound = false;
  public isLoadingMutatation = false;

  @ViewChild(SnackbarComponent)
  private snackbarComponent: SnackbarComponent;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.authState$$ = this.authService.authState().subscribe((data) => {
      this.onAuthState(data);
    });
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  ngOnDestroy() {
    this.authState$$.unsubscribe();
  }

  public get isDisabled() {
    return !this.formGroup.get('password').value;
  }

  public isError(name: string): boolean {
    const input = this.formGroup.get(name);
    return input.invalid && (input.dirty || input.touched);
  }

  public hasError(name: string, errorCode: string): boolean {
    return this.formGroup.get(name).hasError(errorCode);
  }

  public get password() {
    return this.formGroup.controls.password;
  }

  public onMutate() {
    if (this.isLoadingMutatation) {
      return;
    }

    this.isLoadingMutatation = true;

    this.password.markAsDirty();

    if (!this.formGroup.valid) {
      this.isLoadingMutatation = false;
      return;
    }

    const currentUser = this.authService.auth.currentUser;
    const {password} = this.formGroup.value;

    fromPromise(currentUser.updatePassword(password)).subscribe(() => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
      this.resetFormGroup();
    }, (err) => {
      switch (err.code) {
        case 'auth/requires-recent-login':
          this.login();
          break;
        case 'auth/weak-password':
          this.password.setErrors({[err.code]: true});
          this.isLoadingMutatation = false;
          break;
        default:
      }
    });
  }

  private setFormGroup() {
    this.formGroup = this.formBuilder.group({
      currentPassword: [null, []],
      password: [null, [Validators.required]],
    });
  }

  private resetFormGroup() {
    this.formGroup.reset({currentPassword: '', password: ''});
  }

  private login() {
    const currentUser = this.authService.auth.currentUser;
    const {email} = currentUser;
    const {currentPassword, password} = this.formGroup.value;

    const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);

    fromPromise(currentUser.reauthenticateWithCredential(credential)).pipe(
      mergeMap(() => {
        return fromPromise(currentUser.updatePassword(password));
      }),
    ).subscribe(() => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
      this.resetFormGroup();
      this.isLoadingMutatation = false;
    }, () => {
      this.snackbarComponent.snackbar.show({message: UPDATE_ERROR});
      this.isLoadingMutatation = false;
    });
  }

  private onAuthState(user) {
    if (user) {
      this.setFormGroup();
      this.isLoadingQuery = false;
    } else {
      this.isNotFound = true;
    }
  }
}
