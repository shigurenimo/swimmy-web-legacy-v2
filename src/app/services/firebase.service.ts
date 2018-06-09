import { Injectable } from '@angular/core';

import {
  CollectionReference,
  DocumentReference,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '@firebase/firestore-types';
import { UploadTaskSnapshot } from '@firebase/storage-types';
import { auth, firestore, functions, storage, User } from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseService {
  constructor() {
  }

  public get auth(): auth.Auth {
    return auth();
  }

  public firestore(): firestore.Firestore {
    return firestore();
  }

  public storage(): storage.Storage {
    return storage();
  }

  public get functions(): functions.Functions {
    return functions();
  }

  public createId() {
    return firestore().collection('new').doc().id;
  }
}

export const fromAuth = (_auth: auth.Auth): Observable<User> => {
  return new Observable((subscriber) => {
    const unsubscribe = _auth.onAuthStateChanged(subscriber);

    return {unsubscribe};
  });
};

export const fromQueryRef = (ref: CollectionReference | Query): Observable<QuerySnapshot> => {
  return new Observable(subscriber => {
    const unsubscribe = ref.onSnapshot(subscriber);
    return {unsubscribe};
  });
};

export const fromQueryDocRef = (ref: DocumentReference): Observable<QueryDocumentSnapshot> => {
  return new Observable(subscriber => {
    const unsubscribe = ref.onSnapshot(subscriber);
    return {unsubscribe};
  });
};

export const fromUploadTask = (uploadTask: any): Observable<UploadTaskSnapshot> => {
  const state = storage.TaskEvent.STATE_CHANGED;

  return new Observable((subscriber) => {
    const progress = (uploadTaskSnapshot: UploadTaskSnapshot) => {
      subscriber.next(uploadTaskSnapshot);
    };
    const error = err => {
      subscriber.error(err);
    };
    const complete = () => {
      subscriber.complete();
    };

    uploadTask.on(state, progress, error, complete);

    const unsubscribe = () => {
      uploadTask.cancel();
    };

    return {unsubscribe};
  });
};
