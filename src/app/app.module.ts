// Angular core modules
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

// Modules not from angular core
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { ViewHomeComponent } from './view-home/view-home.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ViewLoginComponent } from './view-login/view-login.component';
import { ViewConfigComponent } from './view-config/view-config.component';
import { ViewInfoComponent } from './view-info/view-info.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ListItemPostComponent } from './list-item-post/list-item-post.component';
import { EditorPostComponent } from './editor-post/editor-post.component';
import { DialogLoginComponent } from './dialog-login/dialog-login.component';
import { FunctionsService } from './services/functions.service';
import { ViewUserDetailComponent } from './view-user-detail/view-user-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewHomeComponent,
    SidenavComponent,
    ViewLoginComponent,
    ViewConfigComponent,
    ViewInfoComponent,
    ViewUserComponent,
    TimelineComponent,
    ListItemPostComponent,
    EditorPostComponent,
    DialogLoginComponent,
    ViewUserDetailComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js',
      {enabled: environment.production})
  ],
  providers: [
    FunctionsService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogLoginComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {
}
