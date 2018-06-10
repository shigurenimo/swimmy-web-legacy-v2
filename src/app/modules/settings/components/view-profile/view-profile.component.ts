import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, mergeMap } from 'rxjs/operators';

import {
  UPDATE_DATA_ERROR,
  UPDATE_DATA_LOADING,
  UPDATE_DATA_SUCCESS,
  UPLOAD_LOADING,
} from '../../../../constants/messages';
import { User } from '../../../../interfaces/user';
import { AuthService } from '../../../../services/auth.service';
import { BrowserService } from '../../../../services/browser.service';
import { FirebaseService } from '../../../../services/firebase.service';
import { StorageService } from '../../../../services/storage.service';
import { UsersService } from '../../../../services/users.service';
import { SnackbarComponent } from '../../../mdc/components/snackbar/snackbar.component';

@Component({
  selector: 'app-view-profile',
  template: `
    <ng-container *ngIf="!isLoadingQuery">
      <div class='block-icon'>
        <input #file type="file" accept="image/*" (change)="onUpload(file.files)">
        <div #upload (click)="file.click()" class='icon' mdc-elevation z2>
          <ng-container *ngIf='!src'>
            <div class='image'></div>
          </ng-container>
          <ng-container *ngIf='src'>
            <img [src]='src | resize:"icon"' class='image'>
          </ng-container>
        </div>
      </div>

      <form [formGroup]='formGroup' class='block-form'>
        <h2 mdc-typography headline6>ユーザ名</h2>
        <div
          mdc-text-field
          withTrailingIcon
          fullwidth
          [disabled]='isLoadingMutation'
          class='mdc-text-field--padding'
        >
          <input mdc-text-field-input formControlName='displayName' placeholder='ユーザ名' (blur)='onMutate()'>
          <i mdc-text-field-icon role="button">perm_identity</i>
          <div mdc-line-ripple></div>
        </div>

        <h2 mdc-typography headline6>コメント</h2>
        <div
          mdc-text-field
          withTrailingIcon
          fullwidth
          [disabled]='isLoadingMutation'
          class='mdc-text-field--padding'
        >
          <input mdc-text-field-input formControlName='description' placeholder='コメント' (blur)='onMutate()'>
          <i mdc-text-field-icon role="button">chat</i>
          <div mdc-line-ripple></div>
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
  styleUrls: ['view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit {
  public formGroup: FormGroup;
  public photoURL = '';
  public isLoadingQuery = true;
  public isLoadingMutation = false;
  public file = null;
  public previewFile = null;
  public user: User;

  @ViewChild(SnackbarComponent)
  private snackbarComponent: SnackbarComponent;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private firebaseService: FirebaseService,
    private storageService: StorageService,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    this.initUser();
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  public get src() {
    return this.previewFile || this.user.photoURL;
  }

  public onMutate() {
    if (this.isLoadingMutation) {
      return;
    }

    this.isLoadingMutation = true;

    this.formGroup.get('displayName').markAsDirty();
    this.formGroup.get('description').markAsDirty();

    if (!this.formGroup.valid) {
      this.isLoadingMutation = false;
      return;
    }

    const {displayName, description} = this.formGroup.value;

    const mutation$ = this.usersService.updateUser({
      displayName: displayName,
      photos: [],
      description: description,
    });

    this.snackbarComponent.snackbar.show({message: UPDATE_DATA_LOADING});

    mutation$.subscribe(() => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
      this.isLoadingMutation = false;
    }, (err) => {
      console.error(err);
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_ERROR});
      this.isLoadingMutation = false;
    });
  }

  public onUpload(files) {
    const [file] = files;

    const photoId = this.firebaseService.createId();
    const objectId = `users/${photoId}`;

    const task$ = this.storageService.upload(objectId, file);

    const filterDownloadURL = (snapshot: any): boolean => {
      return snapshot.bytesTransferred === snapshot.totalBytes;
    };

    const downloadURL$ = task$.pipe(
      filter(filterDownloadURL),
      mergeMap(this.storageService.getDownloadURL),
    );

    const mutation$ = mergeMap((downloadURL: string) => {
      const photos = [{downloadURL, photoId}];
      return this.usersService.updateUser({photos});
    });

    this.snackbarComponent.snackbar.show({message: UPLOAD_LOADING});

    downloadURL$.pipe(mutation$).subscribe((photoURL) => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
    }, err => {
      console.error(err);
    });
  }

  private initUser(): void {
    const user = this.authService.auth.currentUser;
    this.usersService.getUser(user.uid).subscribe((userData) => {
      this.onGetUser(userData);
    });
  }

  private onGetUser(user): void {
    this.user = user;
    this.formGroup = this.formBuilder.group({
      displayName: [user.displayName || '', [Validators.required]],
      description: [user.description || '', []],
    });
    this.isLoadingQuery = false;
  }
}
