import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AngularFireAuth } from 'angularfire2/auth';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardImageComponent } from './components/card-image/card-image.component';
import { CardPostComponent } from './components/card-post/card-post.component';
import { CardThreadComponent } from './components/card-thread/card-thread.component';
import { EditorPostComponent } from './components/editor-post/editor-post.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ViewConfigComponent } from './components/view-config/view-config.component';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { ViewImagesComponent } from './components/view-images/view-images.component';
import { ViewInfoComponent } from './components/view-info/view-info.component';
import { ViewLoginComponent } from './components/view-login/view-login.component';
import { ViewPostsDetailComponent } from './components/view-posts-detail/view-posts-detail.component';
import { ViewSettingsPasswordComponent } from './components/view-settings-password/view-settings-password.component';
import { ViewSettingsProfileComponent } from './components/view-settings-profile/view-settings-profile.component';
import { ViewSettingsUsernameComponent } from './components/view-settings-username/view-settings-username.component';
import { ViewSettingsComponent } from './components/view-settings/view-settings.component';
import { ViewThreadsComponent } from './components/view-threads/view-threads.component';
import { ViewUsersDetailComponent } from './components/view-users-detail/view-users-detail.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { FirebaseModule } from './firebase.module';
import { ResizePipe } from './pipes/resize.pipe';
import { AlgoliaService } from './services/algolia.service';
import { FunctionsService } from './services/functions.service';
import { PostsService } from './services/posts.service';
import { UsersService } from './services/users.service';
import { CardReplyNewComponent } from './components/card-reply-new/card-reply-new.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorPostComponent,
    HeaderComponent,
    SidenavComponent,
    ViewConfigComponent,
    ViewHomeComponent,
    ViewImagesComponent,
    ViewInfoComponent,
    ViewLoginComponent,
    ViewPostsDetailComponent,
    ViewSettingsPasswordComponent,
    ViewSettingsProfileComponent,
    ViewSettingsUsernameComponent,
    ViewSettingsComponent,
    ViewThreadsComponent,
    ViewUsersDetailComponent,
    ViewUsersComponent,
    ResizePipe,
    CardImageComponent,
    CardPostComponent,
    CardThreadComponent,
    CardReplyNewComponent
  ],
  imports: [
    CommonModule,
    FirebaseModule,
    ApolloModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpLinkModule,
    NgZorroAntdModule.forRoot(),
    NoopAnimationsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    FunctionsService,
    PostsService,
    UsersService,
    AlgoliaService
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private afAuth: AngularFireAuth) {
    const httpBearer = setContext(async () => {
      if (this.afAuth.auth.currentUser) {
        const idToken = await this.afAuth.auth.currentUser.getIdToken();
        const bearer = `Bearer ${idToken}`;
        const headers = new HttpHeaders().set('authorization', bearer);
        return {headers};
      } else {
        return {};
      }
    });

    const cache = new InMemoryCache();

    const httpDefault = httpLink.create({
      uri: environment.graphql,
      method: 'POST'
    });

    const httpServiceWorker = httpLink.create({
      uri: environment.graphql,
      method: 'GET'
    });

    apollo.createDefault({
      link: httpBearer.concat(httpDefault),
      cache: cache,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all'
        }
      }
    });

    apollo.createNamed('sw', {
      link: httpBearer.concat(httpServiceWorker),
      cache: cache,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all'
        }
      }
    });
  }
}
