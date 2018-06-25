import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import * as firebase from 'firebase/app';
import { from } from 'rxjs';
import { pipe } from 'rxjs/internal-compatibility';
import { mergeMap, tap } from 'rxjs/operators';

import { UPDATE_DATA_SUCCESS, UPDATE_ERROR } from '../../../../constants/messages';
import { AuthService } from '../../../../services/auth.service';
import { BrowserService } from '../../../../services/browser.service';
import { DataLayerService } from '../../../../services/data-layer.service';
import { SnackbarComponent } from '../../../mdc/components/snackbar/snackbar.component';

@Component({
  selector: 'app-view-password',
  template: `
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

    <div mdc-snackbar align-start>
      <div mdc-snackbar-text></div>
      <div mdc-snackbar-action-wrapper>
        <button mdc-snackbar-action-button></button>
      </div>
    </div>
  `,
  styleUrls: ['view-password.component.scss'],
})
export class ViewPasswordComponent implements OnInit {
  public formGroup: FormGroup;
  public passwordPlaceholder = Math.random().toString(36).slice(-16);
  public isLoadingMutatation = false;

  @ViewChild(SnackbarComponent)
  private snackbarComponent: SnackbarComponent;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private browserService: BrowserService,
    private activatedRoute: ActivatedRoute,
    private dataLayerService: DataLayerService,
  ) {
  }

  public ngOnInit() {
    this.setFormGroup();
    const snapshot = this.activatedRoute.snapshot;
    this.browserService.updateAppUIFromSnapshot(snapshot);
    this.browserService.updateHtmlFromSnapshot(snapshot);
    this.dataLayerService.pushPage();
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

  public onMutate() {
    if (this.isLoadingMutatation) {
      return;
    }

    this.isLoadingMutatation = true;

    this.formGroup.get('password').markAsDirty();

    if (!this.formGroup.valid) {
      this.isLoadingMutatation = false;
      return;
    }

    const {password} = this.formGroup.value;

    const updatePassword$ = this.authService.updatePassword(password);

    updatePassword$.subscribe(() => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
      this.resetFormGroup();
    }, (err) => {
      switch (err.code) {
        case 'auth/requires-recent-login':
          this.login();
          break;
        case 'auth/weak-password':
          this.formGroup.get('password').setErrors({[err.code]: true});
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
    const {email} = this.authService.auth().currentUser;
    const {currentPassword, password} = this.formGroup.value;

    const credential = this.authService.auth.EmailAuthProvider.credential(email, currentPassword);

    const pipeline = pipe(
      mergeMap(() => {
        return this.authService.updatePassword(password);
      }),
      tap(() => {
        this.isLoadingMutatation = false;
      }),
    );

    const reauthenticate$ = this.authService.reauthenticateWithCredential(credential);

    pipeline(reauthenticate$).subscribe(() => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
      this.resetFormGroup();
    }, () => {
      this.snackbarComponent.snackbar.show({message: UPDATE_ERROR});
    });
  }
}
