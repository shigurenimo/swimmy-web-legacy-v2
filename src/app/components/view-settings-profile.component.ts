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
      <ng-container *ngIf='isLoadingQuery'>
        <div class='spinner'>
          <nz-spin [nzTip]='nzTip'></nz-spin>
        </div>
      </ng-container>
      <ng-container *ngIf='!isLoadingQuery && !isNotFound'>
        <div class='icon'>
          <nz-upload
            nzName='avatar'
            [nzShowUploadList]='false'
            (nzChange)='onUpload($event)'
          >
            <nz-avatar nzIcon='user' [nzSrc]='nzSrc'></nz-avatar>
          </nz-upload>
        </div>
        <div class='form'>
          <form nz-form [formGroup]='formGroup' (ngSubmit)='onMutate()'>
            <nz-form-item>
              <nz-form-label nzRequired>ディスプレイネーム</nz-form-label>
              <nz-form-control nzHasFeedback>
                <nz-input-group nzPrefixIcon="anticon anticon-user">
                  <input
                    nz-input
                    formControlName='displayName'
                    placeholder='uufish'
                    (blur)='onMutate()'
                  >
                </nz-input-group>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>自己紹介</nz-form-label>
              <nz-form-control nzHasFeedback>
                <textarea
                  nz-input
                  formControlName='description'
                  placeholder='あなたの自己紹介'
                  nzAutosize
                  (blur)='onMutate()'
                >
                </textarea>
              </nz-form-control>
            </nz-form-item>
          </form>
        </div>
      </ng-container>
      <div *ngIf='!isLoadingQuery && isNotFound'>
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
  private authState$$ = null;

  public formGroup: FormGroup;
  public photoURL = '';
  public nzTip = '読み込み中..';
  public file = null;
  public isLoadingQuery = true;
  public isNotFound = false;
  public isLoadingMutation = false;

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
    if (this.isLoadingMutation) { return; }

    this.isLoadingMutation = true;

    this.markAsDirty();

    if (!this.formGroup.valid) {
      this.isLoadingMutation = false;
      return;
    }

    const messageId = this.messageService.loading(UPDATE_DATA_LOADING).messageId;
    const { displayName, description } = this.formGroup.value;
    const uid = this.afAuth.auth.currentUser.uid;

    const mutation$ = this.usersService.updateUser(uid, {
      displayName: displayName,
      photos: null,
      description: description
    });

    mutation$.subscribe(() => {
      this.messageService.success(UPDATE_DATA_SUCCESS);
      this.messageService.remove(messageId);
      this.isLoadingMutation = false;
    }, () => {
      this.messageService.error(UPDATE_DATA_ERROR);
      this.messageService.remove(messageId);
      this.isLoadingMutation = false;
    });
  }

  public onUpload (event) {
    this.file = event.file;
    const photoId = this.afFirestore.createId();
    const uid = this.afAuth.auth.currentUser.uid;
    const objectId = `users/${photoId}`;

    const task = this.afStorage.upload(objectId, event.file.originFileObj);

    const messageId = this.messageService.loading(UPLOAD_LOADING).messageId;

    const downloadURL$ = task.snapshotChanges();

    const mutation$ = mergeMap(({ downloadURL }) => {
      const photos = [{ downloadURL, photoId }];
      return this.usersService.updateUser(uid, { photos });
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

  private onGetUser (user) {
    this.formGroup = this.formBuilder.group({
      displayName: [user.displayName || '', [Validators.required]],
      description: [user.description || '', []]
    });
    this.photoURL = user.photoURL;
    this.isLoadingQuery = false;
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
