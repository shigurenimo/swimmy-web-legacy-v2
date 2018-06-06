import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadFile } from 'ng-zorro-antd';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, mergeMap } from 'rxjs/operators';
import { Photo } from '../../interfaces/input';

import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-card-reply-new',
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onAddPost()">
      <div mdc-text-field withTrailingIcon fullwidth [disabled]='isLoadingMutation' class='mdc-text-field--padding'>
        <input mdc-text-field-input formControlName='content' [placeholder]='textareaPlaceholder'>
        <i mdc-text-field-icon role="button">reply</i>
        <div mdc-line-ripple></div>
      </div>
    </form>
  `,
  styleUrls: ['card-reply-new.component.scss']
})
export class CardReplyNewComponent implements OnInit {
  @Input() repliedPostId: string;

  public formGroup: FormGroup;
  public textareaPlaceholder = 'レス';
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

  private markAsDirty () {
    this.formGroup.controls.content.markAsDirty();
  }

  public onAddPost () {
    if (!this.afAuth.auth.currentUser) {
      return;
    }

    if (this.isLoadingMutation) {
      return;
    }

    this.isLoadingMutation = true;

    this.markAsDirty();

    const { content } = this.formGroup.value;

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

      const post$ = mergeMap((photos: Photo[]) => {
        return this.posts.addReplyPost({
          content: content,
          photos: photos,
          replyPostId: this.repliedPostId
        });
      });

      $mutation = uploadImages$.pipe(post$);
    } else {
      $mutation = this.posts.addReplyPost({
        content: content,
        photos: [],
        replyPostId: this.repliedPostId
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

  public uploadImage (file) {
    const originFileObj = file.originFileObj;
    const photoId = this.afStore.createId();
    const filePath = `posts/${photoId}`;
    const task = this.afStorage.upload(filePath, originFileObj);
    const downloadURL$ = task.snapshotChanges();
    const map$ = map(({ downloadURL }) => {
      return { downloadURL, photoId };
    });
    return downloadURL$.pipe(map$);
  }

  public ngOnInit () {
    this.formGroup = this.formBuilder.group({
      content: ['', [Validators.maxLength(200)]]
    });
  }
}
