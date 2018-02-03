import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import 'firebase/storage';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EditorPostComponent } from './editor-post/editor-post.component';
import { DialogLoginComponent } from './dialog-login/dialog-login.component';
import { ListItemPostComponent } from './list-item-post/list-item-post.component';
import { MaterialModule } from './material.module';
import { FunctionsService } from './services/functions.service';
import { UsersService } from './services/users.service';
import { PostsService } from './services/posts.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ViewHomeComponent } from './view-home/view-home.component';
import { ViewLoginComponent } from './view-login/view-login.component';
import { ViewConfigComponent } from './view-config/view-config.component';
import { ViewInfoComponent } from './view-info/view-info.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ViewUserDetailComponent } from './view-user-detail/view-user-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorPostComponent,
    DialogLoginComponent,
    ListItemPostComponent,
    SidenavComponent,
    ViewConfigComponent,
    ViewHomeComponent,
    ViewInfoComponent,
    ViewLoginComponent,
    ViewUserComponent,
    ViewUserDetailComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ApolloModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpLinkModule,
    NoopAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    FunctionsService,
    PostsService,
    UsersService
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    DialogLoginComponent
  ],
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

    const httpQuery = httpLink.create({
      uri: environment.graphql,
      method: 'GET'
    });

    const httpMutation = httpLink.create({
      uri: environment.graphql,
      method: 'POST'
    });

    apollo.createDefault({
      link: httpBearer.concat(httpQuery),
      cache: cache
    });

    apollo.createNamed('mutation', {
      link: httpBearer.concat(httpMutation),
      cache: cache
    });
  }
}
