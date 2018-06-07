import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AngularFireAuth } from 'angularfire2/auth';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardImageComponent } from './components/card-image/card-image.component';
import { CardPostComponent } from './components/card-post/card-post.component';
import { CardReplyNewComponent } from './components/card-reply-new/card-reply-new.component';
import { ChipSetPostComponent } from './components/chip-set-post/chip-set-post.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { EditorPostComponent } from './components/editor-post/editor-post.component';
import { ListItemThreadComponent } from './components/list-item-thread/list-item-thread.component';
import { TopAppBarComponent } from './components/top-app-bar/top-app-bar.component';
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
import { CoreModule } from './modules/core/core.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { SharedModule } from './modules/shared/shared.module';
import { ElapsedDatePipe } from './pipes/elapsed-date.pipe';
import { AlgoliaService } from './services/algolia.service';
import { BrowserService } from './services/browser.service';
import { DrawerService } from './services/drawer.service';
import { FunctionsService } from './services/functions.service';
import { PostsService } from './services/posts.service';
import { UsersService } from './services/users.service';
import { WindowService } from './services/window.service';

@NgModule({
  declarations: [
    AppComponent,
    EditorPostComponent,
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
    CardImageComponent,
    CardPostComponent,
    CardReplyNewComponent,
    DrawerComponent,
    TopAppBarComponent,
    ListItemThreadComponent,
    ChipSetPostComponent,
    ElapsedDatePipe,
  ],
  imports: [
    CoreModule,
    SharedModule,
    FirebaseModule,
    ApolloModule,
    AppRoutingModule,
    BrowserModule,
    HttpLinkModule,
    NoopAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    AlgoliaService,
    BrowserService,
    DrawerService,
    FunctionsService,
    WindowService,
    PostsService,
    UsersService,
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [],
  schemas: [],
})
export class AppModule {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private afAuth: AngularFireAuth,
  ) {
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
      method: 'POST',
    });

    const httpServiceWorker = httpLink.create({
      uri: environment.graphql,
      method: 'GET',
    });

    apollo.createDefault({
      link: httpBearer.concat(httpDefault),
      cache: cache,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
        },
      },
    });

    apollo.createNamed('sw', {
      link: httpBearer.concat(httpServiceWorker),
      cache: cache,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
        },
      },
    });
  }
}
