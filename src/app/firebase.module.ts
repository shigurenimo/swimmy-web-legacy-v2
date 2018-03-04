import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { environment } from '../environments/environment';

if (!firebase.apps.length) {
  firebase.initializeApp(environment.firebase);
}

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase)
  ]
})
export class FirebaseModule {
}
