import { Injectable } from '@angular/core';
import { UploadTaskSnapshot } from '@firebase/storage-types';

import { storage } from 'firebase/app';
import { combineLatest, from, Observable } from 'rxjs';

import { FirebaseService, fromUploadTask } from './firebase.service';

@Injectable()
export class StorageService {
  constructor(private firebaseService: FirebaseService) {
  }

  public upload(path: string, file: any) {
    const storageRef = this.firebaseService.storage().ref();

    const ref = storageRef.child(path);

    const uploadTask = ref.put(file);

    return fromUploadTask(uploadTask);
  }

  public getDownloadURL(snapshot: UploadTaskSnapshot): Observable<string> {
    const promise = snapshot.ref.getDownloadURL();

    return from(promise);
  }

  public filterDownloadURL(snapshot: UploadTaskSnapshot): boolean {
    return snapshot.bytesTransferred === snapshot.totalBytes;
  };

  public watchUploadTask(uploadTask): Observable<any> {
    return new Observable(({next, error, complete}) => {
      const {STATE_CHANGED} = storage.TaskEvent;

      uploadTask.on(STATE_CHANGED, next, error, complete);

      return {unsubscribe: uploadTask.cancel};
    });
  }

  public watchUploadTasks(uploadTasks): Observable<any[]> {
    const uploadTasks$ = uploadTasks.map((uploadTask) => {
      return this.watchUploadTask(uploadTask);
    });

    return combineLatest(uploadTasks$);
  }

  public put(ref, data: any, metadata?): Observable<any> {
    const uploadTask = ref.put(data, metadata);

    return this.watchUploadTask(uploadTask);
  }

  public getProgress(snapshot) {
    return (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  }
}
