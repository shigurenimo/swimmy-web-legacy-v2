import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from 'angularfire2';

import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import 'firebase/firestore';
import { enUS, NgZorroAntdModule, NZ_LOCALE } from 'ng-zorro-antd';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorPostComponent } from './editor-post/editor-post.component';
import { HeaderComponent } from './header/header.component';
import { ListItemPostComponent } from './list-item-post/list-item-post.component';
import { FunctionsService } from './services/functions.service';
import { PostsService } from './services/posts.service';
import { UsersService } from './services/users.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ViewConfigComponent } from './view-config/view-config.component';
import { ViewHomeComponent } from './view-home/view-home.component';
import { ViewInfoComponent } from './view-info/view-info.component';
import { ViewLoginComponent } from './view-login/view-login.component';
import { ViewUsersDetailComponent } from './view-users-detail/view-users-detail.component';
import { ViewUsersComponent } from './view-users/view-users.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorPostComponent,
    HeaderComponent,
    ListItemPostComponent,
    SidenavComponent,
    ViewConfigComponent,
    ViewHomeComponent,
    ViewInfoComponent,
    ViewLoginComponent,
    ViewUsersComponent,
    ViewUsersDetailComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
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
    {provide: NZ_LOCALE, useValue: enUS}
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
    const httpBearer = setContext(() => {
      if (this.afAuth.auth.currentUser) {
        return this.afAuth.auth.currentUser.getIdToken()
          .then((idToken) => {
            const bearer = `Bearer ${idToken}`;
            const headers = new HttpHeaders().set('authorization', bearer);
            return {headers};
          });
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
