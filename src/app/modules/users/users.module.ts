import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ViewDetailComponent } from './components/view-detail/view-detail.component';
import { usersRoutes } from './users-routing.module';

@NgModule({
  declarations: [
    ViewDetailComponent,
  ],
  imports: [
    RouterModule.forChild(usersRoutes),
    SharedModule,
  ]
})
export class UsersModule {
}
