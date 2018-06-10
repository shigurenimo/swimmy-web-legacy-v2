import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ListItemThreadComponent } from './components/list-item-thread/list-item-thread.component';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { threadRoutes } from './threads-routing.module';

@NgModule({
  declarations: [
    ViewHomeComponent,
    ListItemThreadComponent,
  ],
  imports: [
    RouterModule.forChild(threadRoutes),
    SharedModule,
  ]
})
export class ThreadsModule {
}
