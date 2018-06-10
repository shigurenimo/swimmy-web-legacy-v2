import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { ViewPasswordComponent } from './components/view-password/view-password.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ViewUsernameComponent } from './components/view-username/view-username.component';
import { settingsRoutes } from './settings-routing.module';

@NgModule({
  declarations: [
    ViewPasswordComponent,
    ViewProfileComponent,
    ViewUsernameComponent,
    ViewHomeComponent,
  ],
  imports: [
    RouterModule.forChild(settingsRoutes),
    SharedModule,
  ]
})
export class SettingsModule {
}
