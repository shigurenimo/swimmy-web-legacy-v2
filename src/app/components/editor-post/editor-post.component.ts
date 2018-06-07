import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, mergeMap } from 'rxjs/operators';
import { Photo } from '../../interfaces/input';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-editor-post',
  template: `
    <form [formGroup]='formGroup' (ngSubmit)='onAddPost()'>
      <div mdc-text-field withTrailingIcon fullwidth [disabled]='isLoadingMutation' class='text-field'>
        <input mdc-text-field-input formControlName='content' [placeholder]='textareaPlaceholder'>
        <i mdc-text-field-icon role="button">create</i>
        <div mdc-line-ripple></div>
      </div>
      
      <!--
      <div class='actions'>
        <input #file type="file" accept="image/*" (change)="onChangeFiles(file.files)">

        <button #upload (click)="file.click()" mdc-button raised>
          <i mdc-button-icon>link</i>
          <span>画像</span>
        </button>
      </div>
      -->
    </form>

    <!--
    <div *ngIf='previewFiles[0]' class='images'>
      <ul mdc-image-list>
        <ng-container *ngFor='let file of previewFiles'>
          <li mdc-image-list-item>
            <div mdc-image-list-image imageAspectContainer>
              <img mdc-image-list-image [src]="file">
            </div>
          </li>
        </ng-container>
      </ul>
    </div>
    -->
  `,
  styleUrls: ['editor-post.component.scss']
})
export class EditorPostComponent implements OnInit {
  public formGroup: FormGroup;
  public textareaPlaceholder = 'もしもし';
  public isLoadingMutation = false;
  public files = [];
  public previewFiles = [];

  constructor (
    private formBuilder: FormBuilder,
    private posts: PostsService,
    public afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    private afStore: AngularFirestore) {
  }

  public onChangeFiles (files) {
    const [file] = files;
    const reader = new FileReader();

    reader.onload = (event: any) => {
      this.previewFiles.push(event.target.result);
      this.files.push(file);
    };

    reader.readAsDataURL(file);
  }

  private resetFormGroup () {
    this.formGroup.reset({ content: '' });
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

    if (!this.files.length && !content) {
      this.isLoadingMutation = false;
      return;
    }

    if (this.files.length) {
      const uploadImageMap$ = this.files.map((file) => {
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
    const map$ = map(({ downloadURL }): Photo => {
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
