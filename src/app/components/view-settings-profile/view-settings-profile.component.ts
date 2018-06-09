import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { UPDATE_DATA_ERROR, UPDATE_DATA_LOADING, UPDATE_DATA_SUCCESS, UPLOAD_LOADING } from '../../constants/messages';
import { User } from '../../interfaces/user';
import { SnackbarComponent } from '../../modules/mdc/components/snackbar/snackbar.component';
import { AuthService } from '../../services/auth.service';
import { BrowserService } from '../../services/browser.service';
import { FirebaseService } from '../../services/firebase.service';
import { StorageService } from '../../services/storage.service';
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
  public user: User;

  private authState$$ = null;

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

  public get src() {
    return this.previewFile || this.user.photoURL;
  }

  ngOnInit() {
    this.initUser();
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  ngOnDestroy() {
    this.authState$$.unsubscribe();
  }

  public onChangeFiles(files) {
    const [file] = files;

    this.snackbarComponent.snackbar.show({message: 'アップロードしています'});
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
    const uid = this.authService.currentUser.uid;

    const mutation$ = this.usersService._updateUser(uid, {
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
    const uid = this.authService.currentUser.uid;
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
      console.log('downloadURL', downloadURL);
      const photos = [{downloadURL, photoId}];
      return this.usersService.updateUser({id: uid, photos});
    });

    this.snackbarComponent.snackbar.show({message: UPLOAD_LOADING});

    downloadURL$.pipe(mutation$).subscribe((photoURL) => {
      this.snackbarComponent.snackbar.show({message: UPDATE_DATA_SUCCESS});
    }, err => {
      console.error(err);
    });
  }

  private uploadImage(): Observable<string> {
    const uid = this.firebaseService.createId();
    const fileName = `${uid}`;
    const filePath = `icons/${fileName}`;

    const task$ = this.storageService.upload(filePath, this.file);

    const filterDownloadURL = (snapshot: any): boolean => {
      return snapshot.bytesTransferred === snapshot.totalBytes;
    };

    return task$.pipe(
      filter(filterDownloadURL),
      mergeMap(this.storageService.getDownloadURL),
    );
  }

  private initUser(): void {
    const user = this.authService.auth.currentUser;
    if (user) {
      this.usersService.getUser(user.uid).subscribe((userData) => {
        this.onGetUser(userData);
      });
    } else {
      this.isNotFound = true;
    }
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
