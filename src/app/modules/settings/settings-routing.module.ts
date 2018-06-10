import { ViewHomeComponent } from './components/view-home/view-home.component';
import { ViewPasswordComponent } from './components/view-password/view-password.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ViewUsernameComponent } from './components/view-username/view-username.component';

export const settingsRoutes = [{
  path: 'password',
  component: ViewPasswordComponent,
  data: {title: '設定 | パスワード'},
}, {
  path: 'profile',
  component: ViewProfileComponent,
  data: {title: '設定 | プロフィール'},
}, {
  path: 'username',
  component: ViewUsernameComponent,
  data: {title: '設定 | ユーザネーム'},
}, {
  path: '',
  component: ViewHomeComponent,
  data: {title: '設定'},
}];
