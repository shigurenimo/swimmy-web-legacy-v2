import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewConfigComponent } from './view-config/view-config.component';
import { ViewHomeComponent } from './view-home/view-home.component';
import { ViewInfoComponent } from './view-info/view-info.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ViewLoginComponent } from './view-login/view-login.component';

const routes: Routes = [
  {path: 'config', component: ViewConfigComponent},
  {path: 'info', component: ViewInfoComponent},
  {path: 'user/:id', component: ViewUserComponent},
  {path: 'login', component: ViewLoginComponent},
  {path: '', component: ViewHomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
