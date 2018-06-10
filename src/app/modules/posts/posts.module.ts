import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FormReplyNewComponent } from './components/form-reply-new/form-reply-new.component';
import { ListItemPostComponent } from './components/list-item-post/list-item-post.component';
import { ViewDetailComponent } from './components/view-detail/view-detail.component';
import { postsRoutes } from './posts-routing.module';

@NgModule({
  declarations: [
    ViewDetailComponent,
    ListItemPostComponent,
    FormReplyNewComponent,
  ],
  imports: [
    RouterModule.forChild(postsRoutes),
    SharedModule,
  ]
})
export class PostsModule {
}
