import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FormReplyNewComponent } from './components/form-reply-new/form-reply-new.component';
import { ListItemPostComponent } from './components/list-item-post/list-item-post.component';
import { ListItemReplyComponent } from './components/list-item-reply/list-item-reply.component';
import { ViewDetailComponent } from './components/view-detail/view-detail.component';
import { postsRoutes } from './posts-routing.module';

@NgModule({
  declarations: [
    ViewDetailComponent,
    ListItemPostComponent,
    ListItemReplyComponent,
    FormReplyNewComponent,
  ],
  imports: [
    RouterModule.forChild(postsRoutes),
    SharedModule,
  ],
})
export class PostsModule {
}
