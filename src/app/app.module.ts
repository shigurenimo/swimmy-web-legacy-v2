import { HttpHeaders } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';

import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { take } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardImageComponent } from './components/card-image/card-image.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { FormPostNewComponent } from './components/form-post-new/form-post-new.component';
import { FormReplyNewComponent } from './components/form-reply-new/form-reply-new.component';
import { ListItemPostComponent } from './components/list-item-post/list-item-post.component';
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
import { SharedModule } from './modules/shared/shared.module';
import { ElapsedDatePipe } from './pipes/elapsed-date.pipe';
import { AlgoliaService } from './services/algolia.service';
import { AuthService } from './services/auth.service';
import { BrowserService } from './services/browser.service';
import { DrawerService } from './services/drawer.service';
import { FirebaseService } from './services/firebase.service';
import { FunctionsService } from './services/functions.service';
import { PostsService } from './services/posts.service';
import { StorageService } from './services/storage.service';
import { UsersService } from './services/users.service';
import { WindowService } from './services/window.service';

@NgModule({
  declarations: [
    AppComponent,
    FormPostNewComponent,
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
    ListItemPostComponent,
    FormReplyNewComponent,
    DrawerComponent,
    TopAppBarComponent,
    ListItemThreadComponent,
    ElapsedDatePipe,
  ],
  imports: [
    CoreModule,
    SharedModule,
    ApolloModule,
    AppRoutingModule,
    BrowserModule,
    HttpLinkModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    AlgoliaService,
    AuthService,
    BrowserService,
    DrawerService,
    FunctionsService,
    FirebaseService,
    PostsService,
    StorageService,
    UsersService,
    WindowService,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => {
        return authService.authState().pipe(take((1))).toPromise();
      },
      deps: [AuthService],
      multi: true,
    },
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
    private authService: AuthService,
  ) {
    const httpBearer = setContext(async () => {
      if (this.authService.currentUser) {
        const idToken = await this.authService.currentUser.getIdToken();
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
