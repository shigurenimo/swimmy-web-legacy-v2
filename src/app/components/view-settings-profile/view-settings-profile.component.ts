import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { NzMessageService } from 'ng-zorro-antd';

import { mergeMap } from 'rxjs/operators';
import { UPDATE_DATA_ERROR, UPDATE_DATA_LOADING, UPDATE_DATA_SUCCESS, UPLOAD_LOADING } from '../../constants/messages';
import { SnackbarComponent } from '../../modules/mdc/components/snackbar/snackbar.component';
import { BrowserService } from '../../services/browser.service';

import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-view-settings-profile',
  template: `
    <ng-container *ngIf='!isLoadingQuery && !isNotFound'>
      <div class='block-icon'>
        <input #file type="file" accept="image/*" (change)="onUpload(file.files)">
        <div #upload (click)="file.click()" class='icon' mdc-elevation z2>
          <ng-container *ngIf='!src'>
            <div class='image'></div>
          </ng-container>
          <ng-container *ngIf='src'>
            <img [src]='src' class='image'>
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

    <div *ngIf='!isLoadingQuery && isNotFound'>
      <p>データの取得に失敗しました</p>
    </div>
  `,
  styleUrls: ['view-settings-profile.component.scss'],
})
export class ViewSettingsProfileComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public photoURL = '';
  public isLoadingQuery = true;
  public isNotFound = false;
  public isLoadingMutation = false;
  public file = null;
  public previewFile = null;

  private authState$$ = null;

  @ViewChild(SnackbarComponent)
  private snackbarComponent: SnackbarComponent;

  constructor(
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: NzMessageService,
    private afFirestore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.authState$$ = this.afAuth.authState.subscribe((data) => {
      this.onAuthState(data);
    });
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  ngOnDestroy() {
    this.authState$$.unsubscribe();
  }

  public onChangeFiles(files) {
    const [file] = files;

    this.snackbarComponent.snackbar.show({message: 'アップロードしています'});
  }

  public get src() {
    return this.previewFile || this.photoURL;
  }

  public onMutate() {
    if (this.isLoadingMutation) {
      return;
    }

    this.isLoadingMutation = true;

    this.markAsDirty();

    if (!this.formGroup.valid) {
      this.isLoadingMutation = false;
      return;
    }

    const {displayName, description} = this.formGroup.value;
    const uid = this.afAuth.auth.currentUser.uid;

    const mutation$ = this.usersService.updateUser(uid, {
      displayName: displayName,
      photos: [],
      description: description,
    });

    this.snackbarComponent.snackbar.show({message: UPDATE_DATA_LOADING});

    mutation$.subscribe(() => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
      this.isLoadingMutation = false;
    }, (err) => {
      console.log(err);
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_ERROR});
      this.isLoadingMutation = false;
    });
  }

  public onUpload(files) {
    const [file] = files;

    const photoId = this.afFirestore.createId();
    const uid = this.afAuth.auth.currentUser.uid;
    const objectId = `users/${photoId}`;

    const task = this.afStorage.upload(objectId, file);

    const downloadURL$ = task.snapshotChanges();

    const mutation$ = mergeMap((a: any) => {
      const photos = [{downloadURL: a.downloadURL, photoId}];
      return this.usersService.updateUser(uid, {photos});
    });

    this.snackbarComponent.snackbar.show({message: UPLOAD_LOADING});

    downloadURL$.pipe(mutation$).subscribe((photoURL) => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
    }, err => {
      console.error(err);
    });
  }

  private onGetUser(user) {
    this.formGroup = this.formBuilder.group({
      displayName: [user.displayName || '', [Validators.required]],
      description: [user.description || '', []],
    });
    this.photoURL = user.photoURL;
    this.isLoadingQuery = false;
  }

  private onAuthState(user) {
    if (user) {
      this.usersService.getUser(user.uid).subscribe((userData) => {
        this.onGetUser(userData);
      });
    } else {
      this.isNotFound = true;
    }
  }

  private markAsDirty() {
    this.formGroup.controls.displayName.markAsDirty();
    this.formGroup.controls.description.markAsDirty();
  }
}
