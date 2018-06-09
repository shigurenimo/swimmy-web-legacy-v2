import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { hmrBootstrap } from './hmr';

if (environment.production) {
  enableProdMode();
}

if (!firebase.apps.length) {
  firebase.initializeApp(environment.firebase);
  firebase.firestore().settings({timestampsInSnapshots: true});
  if (environment.enablePersistence) {
    firebase.firestore().enablePersistence().catch(err => {
      console.error(err);
    });
  }
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.hmr) {
  if (module['hot']) {
    hmrBootstrap(module, bootstrap);
  }
} else {
  bootstrap().catch((err) => {
    console.error(err);
  });
}
