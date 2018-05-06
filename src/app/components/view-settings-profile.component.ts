import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { NzMessageService } from 'ng-zorro-antd';

import { mergeMap } from 'rxjs/operators';
import { UPDATE_DATA_ERROR, UPDATE_DATA_LOADING, UPDATE_DATA_SUCCESS, UPLOAD_LOADING } from '../constants/messages';

import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-view-settings-profile',
  template: `
    <app-header [goBack]='true'>
      <ng-template #title>
        プロファイル
      </ng-template>
    </app-header>

    <div>
      <ng-container *ngIf='isQuery'>
        <div class='spinner'>
          <nz-spin [nzTip]='nzTip' nzSize='large'></nz-spin>
        </div>
      </ng-container>
      <ng-container *ngIf='!isQuery && !isNotFound'>
        <div class='icon'>
          <nz-upload
            nzName='avatar'
            [nzShowUploadList]='false'
            (nzChange)='onUpload($event)'>
            <nz-avatar nzIcon='user' [nzSrc]='nzSrc'></nz-avatar>
          </nz-upload>
        </div>
        <div class='form'>
          <form nz-form [formGroup]='formGroup' (ngSubmit)='onMutate()'>
            <div nz-form-item>
              <div nz-form-label nz-col>
                <label nz-form-item-required>ディスプレイネーム</label>
              </div>
              <div nz-form-control nzHasFeedback>
                <nz-input
                  formControlName='displayName'
                  [nzPlaceHolder]='displayNamePlaceHolder'
                  [nzSize]='nzSize'
                  (nzBlur)='onMutate()'
                >
                  <ng-template #prefix>
                    <i class='anticon anticon-user'></i>
                  </ng-template>
                </nz-input>
              </div>
            </div>
            <div nz-form-item>
              <div nz-form-label nz-col>
                <label>自己紹介</label>
              </div>
              <div nz-form-control nzHasFeedback>
                <nz-input
                  formControlName='description'
                  [nzPlaceHolder]='descriptionPlaceHolder'
                  nzType='textarea'
                  [nzSize]='nzSize'
                  nzAutosize
                  (nzBlur)='onMutate()'
                >
                </nz-input>
              </div>
            </div>
          </form>
        </div>
      </ng-container>
      <div *ngIf='!isQuery && isNotFound'>
        <p>データの取得に失敗しました</p>
      </div>
    </div>
  `,
  styles: [`
    :host > div {
      margin: 0 auto;
      max-width: 600px;
      padding: 8px;
    }

    .spinner {
      padding: 100px 0 0;
      text-align: center;
    }

    .icon {
      padding-top: 40px;
    }

    .icon ::ng-deep .ant-upload-select {
      display: block;
      margin: 0 auto;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .icon ::ng-deep .ant-avatar {
      display: block;
      height: 100%;
      font-size: 100px;
      width: 100%;
      background: white;
      color: gray;
    }

    .icon ::ng-deep .anticon {
      line-height: 200px;
    }

    .form {
      margin: 0 auto;
      padding-top: 40px;
      max-width: 280px;
    }

    .form-helper {
      padding-top: 8px;
      opacity: 0.8;
    }
  `]
})
export class ViewSettingsProfileComponent implements OnInit, OnDestroy {
  // form state
  public formGroup: FormGroup;
  public photoURL = '';

  // ui state
  public nzSize = 'large';
  public nzTip = '読み込み中..';
  public displayNamePlaceHolder = 'uufish';
  public descriptionPlaceHolder = 'あなたの自己紹介';
  public file = null;

  // http
  public isQuery = true;
  public isNotFound = false;

  // state
  public isMutate = false;

  // subscription
  private authState$$ = null;

  constructor (
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: NzMessageService,
    private afFirestore: AngularFirestore,
    private afStorage: AngularFireStorage) {
  }

  public get nzSrc () {
    if (this.file) {
      return this.file.thumbUrl;
    }
    return this.photoURL;
  }

  public onMutate () {
    if (this.isMutate) { return; }

    this.isMutate = true;

    this.markAsDirty();

    if (!this.formGroup.valid) {
      this.isMutate = false;
      return;
    }

    const messageId = this.messageService.loading(UPDATE_DATA_LOADING).messageId;
    const { displayName, description } = this.formGroup.value;
    const uid = this.afAuth.auth.currentUser.uid;

    const mutation$ = this.usersService.updateUser(uid, {
      displayName: displayName,
      photoURLs: null,
      description: description
    });

    mutation$.subscribe(() => {
      this.messageService.success(UPDATE_DATA_SUCCESS);
      this.messageService.remove(messageId);
      this.isMutate = false;
    }, () => {
      this.messageService.error(UPDATE_DATA_ERROR);
      this.messageService.remove(messageId);
      this.isMutate = false;
    });
  }

  public onUpload (event) {
    this.file = event.file;
    const photoId = this.afFirestore.createId();
    const uid = this.afAuth.auth.currentUser.uid;
    const objectId = `users/${photoId}`;

    const task = this.afStorage.upload(objectId, event.file.originFileObj);

    const messageId = this.messageService.loading(UPLOAD_LOADING).messageId;

    const downloadURL$ = task.downloadURL();

    const mutation$ = mergeMap((photoURL) => {
      this.photoURL = photoURL as string;
      const photoURLs = [{ photoURL, photoId }];
      return this.usersService.updateUser(uid, { photoURLs });
    });

    downloadURL$.pipe(mutation$).subscribe((photoURL) => {
      this.messageService.success(UPDATE_DATA_SUCCESS);
      this.messageService.remove(messageId);
    });
  }

  ngOnInit () {
    this.authState$$ = this.afAuth.authState.subscribe((data) => {
      this.onAuthState(data);
    });
  }

  ngOnDestroy () {
    this.authState$$.unsubscribe();
  }

  private onGetUser (res) {
    const { user } = res.data;
    this.formGroup = this.formBuilder.group({
      displayName: [user.displayName || '', [Validators.required]],
      description: [user.description || '', []]
    });
    this.photoURL = user.photoURL;
    this.isQuery = false;
  }

  private onAuthState (user) {
    if (user) {
      this.usersService.getUser(user.uid).subscribe((userData) => {
        this.onGetUser(userData);
      });
    } else {
      this.isNotFound = true;
    }
  }

  private markAsDirty () {
    this.formGroup.controls.displayName.markAsDirty();
    this.formGroup.controls.description.markAsDirty();
  }
}
