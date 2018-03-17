import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadFile } from 'ng-zorro-antd';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, mergeMap } from 'rxjs/operators';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-editor-post',
  templateUrl: './editor-post.component.html',
  styleUrls: ['./editor-post.component.css']
})
export class EditorPostComponent implements OnInit {
  public formGroup: FormGroup;
  public nzAutosize = {minRows: 1, maxRows: 6};
  public nzPlaceHolder = 'もしもし';
  public fileList: UploadFile[] = [];
  public isMutation = false;

  constructor(
    private formBuilder: FormBuilder,
    private posts: PostsService,
    public afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    private afStore: AngularFirestore) {
  }

  private resetFormGroup() {
    this.formGroup.reset({content: ''});
    this.fileList = [];
  }

  public get content() {
    return this.formGroup.get('content');
  }

  public onAddPost() {
    if (this.isMutation) {
      return;
    }

    this.isMutation = true;

    this.markAsDirty();

    const content = this.content.value;

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
        return this.posts.addPost({
          content: content,
          photoURLs: photoURLs,
          replyPostId: null
        });
      });

      $mutation = uploadImages$.pipe(post$);
    } else {
      $mutation = this.posts.addPost({
        content: content,
        photoURLs: [],
        replyPostId: null
      });
    }

    $mutation.subscribe(() => {
      console.log('reset');
      this.resetFormGroup();
      this.isMutation = false;
    }, (err) => {
      console.error(err);
      this.isMutation = false;
    });
  }

  public uploadImage(file) {
    const originFileObj = file.originFileObj;
    const photoId = this.afStore.createId();
    const filePath = `posts/${photoId}`;
    const task = this.afStorage.upload(filePath, originFileObj);
    const downloadURL$ = task.downloadURL();
    const map$ = map((photoURL) => {
      return {photoURL, photoId};
    });
    return downloadURL$.pipe(map$);
  }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group({
      content: ['', [Validators.maxLength(200)]]
    });
  }

  private markAsDirty() {
    this.formGroup.controls.content.markAsDirty();
  }
}
