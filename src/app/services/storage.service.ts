import { Injectable } from '@angular/core';

import { UploadTaskSnapshot } from '@firebase/storage-types';
import { from, Observable } from 'rxjs';

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

  public getProgress(snapshot) {
    return (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  }
}
