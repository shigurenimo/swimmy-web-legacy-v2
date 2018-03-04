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
import { enUS, NgZorroAntdModule, NZ_LOCALE } from 'ng-zorro-antd';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorPostComponent } from './components/editor-post/editor-post.component';
import { HeaderComponent } from './components/header/header.component';
import { ListItemPostComponent } from './components/list-item-post/list-item-post.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ViewConfigComponent } from './components/view-config/view-config.component';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { ViewInfoComponent } from './components/view-info/view-info.component';
import { ViewLoginComponent } from './components/view-login/view-login.component';
import { ViewUsersDetailComponent } from './components/view-users-detail/view-users-detail.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { FirebaseModule } from './firebase.module';
import { ResizePipe } from './pipes/resize.pipe';
import { FunctionsService } from './services/functions.service';
import { PostsService } from './services/posts.service';
import { UsersService } from './services/users.service';

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
    ViewUsersDetailComponent,
    ResizePipe
  ],
  imports: [
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
    { provide: NZ_LOCALE, useValue: enUS }
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
  constructor (
    private apollo: Apollo,
    private httpLink: HttpLink,
    private afAuth: AngularFireAuth) {
    const httpBearer = setContext(async () => {
      if (this.afAuth.auth.currentUser) {
        const idToken = await this.afAuth.auth.currentUser.getIdToken();
        const bearer = `Bearer ${idToken}`;
        const headers = new HttpHeaders().set('authorization', bearer);
        return { headers };
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
