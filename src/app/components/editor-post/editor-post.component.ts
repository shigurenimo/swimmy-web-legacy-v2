import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { firestore, storage } from 'firebase/app';
import { UploadFile } from 'ng-zorro-antd';

import { FunctionsService } from '../../services/functions.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-editor-post',
  templateUrl: './editor-post.component.html',
  styleUrls: ['./editor-post.component.css']
})
export class EditorPostComponent implements OnInit {
  private messageId = null;

  public formGroup: FormGroup;

  public nzAutosize = {minRows: 1, maxRows: 6};

  public nzPlaceHolder = 'Aro';

  public uploadText = 'アップロード中..';

  public mutateText = '送信中..';

  public fileList: UploadFile[] = [];

  public isMutation = false;

  constructor(
    private fns: FunctionsService,
    private formBuilder: FormBuilder,
    private posts: PostsService,
    public afAuth: AngularFireAuth) {
  }

  public get content() {
    return this.formGroup.get('content');
  }

  public onAddPost() {
    this.isMutation = true;

    this.mutateAddPost().catch((err) => {
      console.error(err);
    });
  }

  public uploadImages() {
    return this.fileList.map((file) => {
      const originFileObj = file.originFileObj;
      const uuid = firestore().collection('posts').doc().id;
      const filePath = `images/${uuid}`;
      const storageRef = storage().ref(filePath);
      return storageRef
        .put(originFileObj)
        .then((snapshot) => {
          return uuid;
        });
    });
  }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group({
      content: ['', [Validators.maxLength(20)]]
    });
  }

  private async mutateAddPost() {
    const content = this.content.value;

    let photoIds = [];

    if (this.afAuth.app.auth().currentUser) {
      if (!this.fileList.length) {
        // this.messageId = this.nzMessage.loading(this.uploadText).messageId;
        photoIds = await Promise.all(this.uploadImages());
        // this.nzMessage.remove(this.messageId);
      }
    }

    console.log(photoIds)

    /*
    return this.posts
      .add({
        content: content,
        photoURLs: downloadURLs,
        replyPostId: null
      })
      .subscribe(() => {
        this.content.setValue('');
      }, (err) => {
        console.error(err);
      }, () => {
        this.isMutation = false;
      });
    */
  }
}
