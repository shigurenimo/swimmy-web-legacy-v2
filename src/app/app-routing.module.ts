import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  {
    path: 'hello',
    loadChildren: 'app/modules/hello/hello.module#HelloModule',
    data: {title: 'hello'},
  }, {
    path: 'images',
    component: ViewImagesComponent,
    data: {title: 'ストレージ'},
  }, {
    path: 'info',
    component: ViewInfoComponent,
    data: {title: '情報'},
  }, {
    path: 'login',
    component: ViewLoginComponent,
    data: {title: 'こんにちは'},
  }, {
    path: 'posts/:postId',
    component: ViewPostsDetailComponent,
    data: {title: 'スレッド'},
  }, {
    path: 'settings/username',
    component: ViewSettingsUsernameComponent,
    data: {title: '設定 | ユーザネーム'},
  }, {
    path: 'settings/password',
    component: ViewSettingsPasswordComponent,
    data: {title: '設定 | パスワード'},
  }, {
    path: 'settings/profile',
    component: ViewSettingsProfileComponent,
    data: {title: '設定 | プロフィール'},
  }, {
    path: 'settings',
    component: ViewSettingsComponent,
    data: {title: '設定'},
  }, {
    path: 'threads',
    component: ViewThreadsComponent,
    data: {title: 'スレッド検索'},
  }, {
    path: ':username',
    component: ViewUsersDetailComponent,
    data: {title: 'ユーザ'},
  }, {
    path: '',
    component: ViewHomeComponent,
    data: {title: 'タイムライン'},
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
