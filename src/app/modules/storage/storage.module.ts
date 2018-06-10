import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { CardImageComponent } from './components/card-image/card-image.component';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { storageRoutes } from './storage-routing.module';

@NgModule({
  declarations: [
    ViewHomeComponent,
    CardImageComponent,
  ],
  imports: [
    RouterModule.forChild(storageRoutes),
    SharedModule,
  ]
})
export class StorageModule {
}
