import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadFile } from 'ng-zorro-antd';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, mergeMap } from 'rxjs/operators';

import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-card-reply-new',
  template: `
    <nz-card>
      <ng-template #body>
        <form nz-form [formGroup]="formGroup">
          <nz-input
            formControlName="content"
            nzType="textarea"
            [nzDisabled]="isMutation"
            [nzAutosize]="true"
            [nzPlaceHolder]="placeHolder">
          </nz-input>
        </form>

        <div class="template-actions" nz-form-control>
          <div nz-row nzType="flex" nzJustify="end" nzAlign="middle" [nzGutter]="8">
        <span nz-col>
          <nz-upload
            *ngIf="afAuth.authState|async"
            [nzShowUploadList]="false"
            [(nzFileList)]="fileList">
            <button nz-button>
              <i class="anticon anticon-link"></i>
              <span>画像</span>
            </button>
          </nz-upload>
        </span>
            <span nz-col>
          <button
            nz-button
            (click)="onAddPost()"
            [nzLoading]="isMutation">
            <span>リプライ</span>
          </button>
        </span>
          </div>
        </div>

        <div *ngIf="fileList[0]" class="template-images">
          <nz-avatar
            *ngFor="let file of fileList"
            class="image-avater"
            nzShape="square"
            nzSize="large"
            [nzSrc]="file.thumbUrl">
          </nz-avatar>
        </div>
      </ng-template>
    </nz-card>
  `,
  styles: [`
    :host ::ng-deep .ant-card-body {
      padding: 8px;
    }

    .template-actions {
      padding-top: 8px;
    }

    .template-actions .input {
      margin-left: 8px;
    }

    .template-images {
      padding-top: 8px;
    }

    .template-images .image-avater {
      display: inline-block;
      vertical-align: top;
      margin-right: 8px;
    }
  `]
})
export class CardReplyNewComponent implements OnInit {
  @Input() repliedPostId: string;

  public formGroup: FormGroup;
  public placeHolder = 'リプライすることができます';
  public fileList: UploadFile[] = [];
  public isMutation = false;

  constructor (
    private formBuilder: FormBuilder,
    private posts: PostsService,
    public afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    private afStore: AngularFirestore) {
  }

  private resetFormGroup () {
    this.formGroup.reset({ content: '' });
    this.fileList = [];
  }

  private markAsDirty () {
    this.formGroup.controls.content.markAsDirty();
  }

  public onAddPost () {
    if (!this.afAuth.auth.currentUser) {
      return;
    }

    if (this.isMutation) {
      return;
    }

    this.isMutation = true;

    this.markAsDirty();

    const { content } = this.formGroup.value;

    let $mutation = null;

    if (!this.fileList.length && !content) {
      this.isMutation = false;
      return;
    }

    if (this.fileList.length) {
      const uploadImageMap$ = this.fileList.map((file) => {
        return this.uploadImage(file);
      });

      const uploadImages$ = combineLatest(uploadImageMap$);

      const post$ = mergeMap((photoURLs) => {
        return this.posts.addReplyPost(this.repliedPostId, {
          content: content,
          photoURLs: photoURLs
        });
      });

      $mutation = uploadImages$.pipe(post$);
    } else {
      $mutation = this.posts.addReplyPost(this.repliedPostId, {
        content: content,
        photoURLs: []
      });
    }

    $mutation.subscribe(() => {
      this.resetFormGroup();
      this.isMutation = false;
    }, (err) => {
      console.error(err);
      this.isMutation = false;
    });
  }

  public uploadImage (file) {
    const originFileObj = file.originFileObj;
    const photoId = this.afStore.createId();
    const filePath = `posts/${photoId}`;
    const task = this.afStorage.upload(filePath, originFileObj);
    const downloadURL$ = task.downloadURL();
    const map$ = map((photoURL) => {
      return { photoURL, photoId };
    });
    return downloadURL$.pipe(map$);
  }

  public ngOnInit () {
    this.formGroup = this.formBuilder.group({
      content: ['', [Validators.maxLength(200)]]
    });
  }
}
