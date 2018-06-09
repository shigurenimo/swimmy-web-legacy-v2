import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { Photo } from '../../interfaces/input';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { PostsService } from '../../services/posts.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-form-reply-new',
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onAddPost()">
      <div mdc-text-field withTrailingIcon fullwidth [disabled]='isLoadingMutation' class='mdc-text-field--padding'>
        <input mdc-text-field-input formControlName='content' [placeholder]='textareaPlaceholder'>
        <i mdc-text-field-icon role="button">reply</i>
        <div mdc-line-ripple></div>
      </div>
    </form>
  `,
  styleUrls: ['form-reply-new.component.scss'],
})
export class FormReplyNewComponent implements OnInit {
  @Input() repliedPostId: string;

  public formGroup: FormGroup;
  public textareaPlaceholder = 'レス';
  public files = [];
  public isLoadingMutation = false;

  constructor(
    private formBuilder: FormBuilder,
    private posts: PostsService,
    public authService: AuthService,
    private storage: StorageService,
    private firebaseService: FirebaseService,
  ) {
  }

  private resetFormGroup() {
    this.formGroup.reset({content: ''});
    this.files = [];
  }

  private markAsDirty() {
    this.formGroup.controls.content.markAsDirty();
  }

  public onAddPost() {
    if (!this.authService.currentUser) {
      return;
    }

    if (this.isLoadingMutation) {
      return;
    }

    this.isLoadingMutation = true;

    this.markAsDirty();

    const {content} = this.formGroup.value;

    let $mutation = null;

    if (!this.files.length && !content) {
      this.isLoadingMutation = false;
      return;
    }

    if (this.files.length) {
      const uploadImageMap$ = this.files.map((file) => {
        return this.uploadImage(file);
      });

      const uploadImages$ = combineLatest(uploadImageMap$);

      const post$ = mergeMap((photos: Photo[]) => {
        return this.posts.addReplyPost({
          content: content,
          photos: photos,
          replyPostId: this.repliedPostId,
        });
      });

      $mutation = uploadImages$.pipe(post$);
    } else {
      $mutation = this.posts.addReplyPost({
        content: content,
        photos: [],
        replyPostId: this.repliedPostId,
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

  public uploadImage(file) {
    const originFileObj = file.originFileObj;
    const photoId = this.firebaseService.createId();
    const filePath = `posts/${photoId}`;
    const task$ = this.storage.upload(filePath, originFileObj);

    return task$.pipe(
      filter(this.storage.filterDownloadURL),
      mergeMap(this.storage.getDownloadURL),
      map((downloadURL) => {
        return {downloadURL, photoId};
      }),
    );
  }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group({
      content: ['', [Validators.maxLength(200)]],
    });
  }
}
