import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadFile } from 'ng-zorro-antd';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, mergeMap } from 'rxjs/operators';
import { Photo } from '../../interfaces/input';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-editor-post',
  template: `
    <form nz-form [formGroup]='formGroup'>
      <nz-form-control>
        <textarea
          nz-input
          formControlName='content'
          [disabled]="isLoadingMutation"
          [nzAutosize]='nzAutosize'
          [placeholder]='textareaPlaceholder'>
        </textarea>
      </nz-form-control>
      <nz-form-control class='actions'>
        <div nz-row nzType="flex" nzJustify="end" nzAlign="middle">
          <nz-upload
            *ngIf='afAuth.authState|async'
            class='input'
            [nzShowUploadList]='false'
            [(nzFileList)]='fileList'>
            <button nz-button>
              <i class='anticon anticon-link'></i>
              <span>画像</span>
            </button>
          </nz-upload>
          <button
            nz-col
            class='input'
            nz-button
            (click)='onAddPost()'
            [nzLoading]='isLoadingMutation'>
            <span>送信</span>
          </button>
        </div>
      </nz-form-control>
      <div *ngIf='fileList[0]' class='images'>
        <nz-avatar
          *ngFor='let file of fileList'
          class='image-avater'
          nzShape='square'
          [nzSrc]='file.thumbUrl'>
        </nz-avatar>
      </div>
    </form>
  `,
  styleUrls: ['editor-post.component.scss']
})
export class EditorPostComponent implements OnInit {
  public formGroup: FormGroup;
  public nzAutosize = { minRows: 1, maxRows: 6 };
  public textareaPlaceholder = 'もしもし';
  public fileList: UploadFile[] = [];
  public isLoadingMutation = false;

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

  public get content () {
    return this.formGroup.get('content');
  }

  public onAddPost (): void {
    if (this.isLoadingMutation) {
      return;
    }

    this.isLoadingMutation = true;

    this.markAsDirty();

    const content = this.content.value;

    let $mutation = null;

    if (!this.fileList.length && !content) {
      this.isLoadingMutation = false;
      return;
    }

    if (this.fileList.length) {
      const uploadImageMap$ = this.fileList.map((file) => {
        return this.uploadImage(file);
      });

      const uploadImages$ = combineLatest(uploadImageMap$);

      const post$ = mergeMap((photoURLs: Photo[]) => {
        return this.posts.addPost({
          content: content,
          photos: photoURLs,
          replyPostId: null
        });
      });

      $mutation = uploadImages$.pipe(post$);
    } else {
      $mutation = this.posts.addPost({
        content: content,
        photos: [],
        replyPostId: null
      });
    }

    $mutation.subscribe(() => {
      this.resetFormGroup();
      this.isLoadingMutation = false;
    }, (err) => {
      console.error(err);
      this.isLoadingMutation = false;
    });
  }

  public uploadImage (file): Observable<Photo> {
    const originFileObj = file.originFileObj;
    const photoId = this.afStore.createId();
    const filePath = `posts/${photoId}`;
    const task = this.afStorage.upload(filePath, originFileObj);

    const downloadURL$ = task.snapshotChanges();
    const map$ = map(({downloadURL}): Photo => {
      return { downloadURL, photoId };
    });

    /*
    const downloadURL$ = task.downloadURL();
    const map$ = map((downloadURL: string): Photo => {
      return { downloadURL, photoId };
    });
    */

    return downloadURL$.pipe(map$);
  }

  public ngOnInit () {
    this.formGroup = this.formBuilder.group({
      content: ['', [Validators.maxLength(200)]]
    });
  }

  private markAsDirty () {
    this.formGroup.controls.content.markAsDirty();
  }
}
