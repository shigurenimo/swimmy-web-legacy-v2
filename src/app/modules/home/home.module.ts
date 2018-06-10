import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FormPostNewComponent } from './components/form-post-new/form-post-new.component';
import { ListItemPostComponent } from './components/list-item-post/list-item-post.component';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { homeRoutes } from './home-routing.module';

@NgModule({
  declarations: [
    ViewHomeComponent,
    ListItemPostComponent,
    FormPostNewComponent,
  ],
  imports: [
    RouterModule.forChild(homeRoutes),
    SharedModule,
  ]
})
export class HomeModule {
}
