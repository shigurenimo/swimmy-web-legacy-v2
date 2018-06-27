import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';

import { take } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './modules/core/core.module';
import { AlgoliaService } from './services/algolia.service';
import { AuthService } from './services/auth.service';
import { BrowserService } from './services/browser.service';
import { DataLayerService } from './services/data-layer.service';
import { DrawerService } from './services/drawer.service';
import { FirebaseService } from './services/firebase.service';
import { PostsService } from './services/posts.service';
import { StorageService } from './services/storage.service';
import { UsersService } from './services/users.service';
import { WindowService } from './services/window.service';
import { ZoneService } from './services/zone';

const AppInitializer = {
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService) => () => {
    return take(1)(authService.authState()).toPromise();
  },
  deps: [AuthService],
  multi: true,
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CoreModule,
    AppRoutingModule,
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    AlgoliaService,
    AuthService,
    BrowserService,
    DataLayerService,
    DrawerService,
    FirebaseService,
    PostsService,
    StorageService,
    UsersService,
    WindowService,
    ZoneService,
    AppInitializer,
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [],
  schemas: [],
})
export class AppModule {
  constructor() {
  }
}
