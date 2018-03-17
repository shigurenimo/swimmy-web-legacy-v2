import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewConfigComponent } from './components/view-config/view-config.component';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { ViewImagesComponent } from './components/view-images/view-images.component';
import { ViewInfoComponent } from './components/view-info/view-info.component';
import { ViewLoginComponent } from './components/view-login/view-login.component';
import { ViewPostsDetailsComponent } from './components/view-posts-details/view-posts-details.component';
import { ViewSettingsPasswordComponent } from './components/view-settings-password/view-settings-password.component';
import { ViewSettingsProfileComponent } from './components/view-settings-profile/view-settings-profile.component';
import { ViewSettingsUsernameComponent } from './components/view-settings-username/view-settings-username.component';
import { ViewSettingsComponent } from './components/view-settings/view-settings.component';
import { ViewThreadsComponent } from './components/view-threads/view-threads.component';
import { ViewUsersDetailComponent } from './components/view-users-detail/view-users-detail.component';

const routes: Routes = [
  {
    path: 'config',
    component: ViewConfigComponent
  }, {
    path: 'images',
    component: ViewImagesComponent
  }, {
    path: 'info',
    component: ViewInfoComponent
  }, {
    path: 'login',
    component: ViewLoginComponent
  }, {
    path: 'posts/:postId',
    component: ViewPostsDetailsComponent
  }, {
    path: 'settings/username',
    component: ViewSettingsUsernameComponent
  }, {
    path: 'settings/password',
    component: ViewSettingsPasswordComponent
  }, {
    path: 'settings/profile',
    component: ViewSettingsProfileComponent
  }, {
    path: 'settings',
    component: ViewSettingsComponent
  }, {
    path: 'threads',
    component: ViewThreadsComponent
  }, {
    path: ':username',
    component: ViewUsersDetailComponent
  }, {
    path: '',
    component: ViewHomeComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
