import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { loginRoutes } from './login-routing.module';

@NgModule({
  declarations: [
    ViewHomeComponent,
  ],
  imports: [
    RouterModule.forChild(loginRoutes),
    SharedModule,
  ],
})
export class LoginModule {
}
