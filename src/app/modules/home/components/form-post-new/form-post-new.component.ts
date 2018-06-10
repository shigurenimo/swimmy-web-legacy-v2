import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { Photo } from '../../../../interfaces/input';
import { FirebaseService } from '../../../../services/firebase.service';
import { PostsService } from '../../../../services/posts.service';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-form-post-new',
  template: `
    <form [formGroup]='formGroup' (ngSubmit)='onAddPost()'>
      <div mdc-text-field withTrailingIcon fullwidth [disabled]='isLoadingMutation' class='text-field'>
        <input mdc-text-field-input formControlName='content' [placeholder]='textareaPlaceholder'>
        <i mdc-text-field-icon role="button">create</i>
        <div mdc-line-ripple></div>
      </div>

      <div class='block-actions'>
        <input #file type="file" accept="image/*" (change)="onChangeFiles(file.files)">
        <button #upload (click)="file.click()" mdc-button raised>
          <i mdc-button-icon>link</i>
          <span>画像</span>
        </button>
      </div>
    </form>

    <div *ngIf='previewFiles[0]' class='block-images'>
      <ng-container *ngFor='let file of previewFiles'>
        <img class="image" [src]="file">
      </ng-container>
    </div>
  `,
  styleUrls: ['form-post-new.component.scss'],
})
export class FormPostNewComponent implements OnInit {
  public formGroup: FormGroup;
  public textareaPlaceholder = 'もしもし';
  public isLoadingMutation = false;
  public files = [];
  public previewFiles = [];

  constructor(
    private formBuilder: FormBuilder,
    private posts: PostsService,
    private firebaseService: FirebaseService,
    private storageService: StorageService,
  ) {
  }

  public get content() {
    return this.formGroup.get('content');
  }

  public onChangeFiles(files) {
    const [file] = files;
    const reader = new FileReader();

    reader.onload = (event: any) => {
      this.previewFiles.push(event.target.result);
      this.files.push(file);
    };

    reader.readAsDataURL(file);
  }

  public onAddPost(): void {
    if (this.isLoadingMutation) {
      return;
    }

    this.isLoadingMutation = true;

    this.markAsDirty();

    const content = this.content.value;

    let $mutation = null;

    if (!this.files.length && !content) {
      this.isLoadingMutation = false;
      return;
    }

    if (this.files.length) {
      const uploadImageMap$ = this.files.map((file) => {
        return this.getDownloadURL(file);
      });

      const uploadImages$ = combineLatest(uploadImageMap$);

      const addPost = (photos: Photo[]) => this.posts.addPost({
        content: content,
        photos: photos,
        replyPostId: null,
      });

      $mutation = uploadImages$.pipe(mergeMap(addPost));
    } else {
      $mutation = this.posts.addPost({
        content: content,
        photos: [],
        replyPostId: null,
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

  public getDownloadURL(file): Observable<Photo> {
    const photoId = this.firebaseService.createId();
    const objectId = `posts/${photoId}`;

    const task$ = this.storageService.upload(objectId, file);

    const filterDownloadURL = (snapshot: any): boolean => {
      return snapshot.bytesTransferred === snapshot.totalBytes;
    };

    const toPhoto = (downloadURL: string): Photo => {
      return {downloadURL, photoId};
    };

    return task$.pipe(
      filter(filterDownloadURL),
      mergeMap(this.storageService.getDownloadURL),
      map(toPhoto),
    );
  }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group({
      content: ['', [Validators.maxLength(200)]],
    });
  }

  private resetFormGroup() {
    this.formGroup.reset({content: ''});
  }

  private markAsDirty() {
    this.formGroup.controls.content.markAsDirty();
  }
}
