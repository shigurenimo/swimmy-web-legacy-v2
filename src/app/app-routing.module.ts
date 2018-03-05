import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewConfigComponent } from './components/view-config/view-config.component';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { ViewInfoComponent } from './components/view-info/view-info.component';
import { ViewLoginComponent } from './components/view-login/view-login.component';
import { ViewSettingsEmailComponent } from './components/view-settings-email/view-settings-email.component';
import { ViewSettingsPasswordComponent } from './components/view-settings-password/view-settings-password.component';
import { ViewSettingsProfileComponent } from './components/view-settings-profile/view-settings-profile.component';
import { ViewSettingsComponent } from './components/view-settings/view-settings.component';
import { ViewUsersDetailComponent } from './components/view-users-detail/view-users-detail.component';

const routes: Routes = [{
  path: 'config',
  component: ViewConfigComponent
}, {
  path: 'info',
  component: ViewInfoComponent
}, {
  path: 'login',
  component: ViewLoginComponent
}, {
  path: 'settings/email',
  component: ViewSettingsEmailComponent
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
  path: ':uid',
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
