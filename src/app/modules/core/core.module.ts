import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { DrawerComponent } from './components/drawer/drawer.component';
import { TopAppBarComponent } from './components/top-app-bar/top-app-bar.component';
import { ViewComponent } from './components/view/view.component';

@NgModule({
  declarations: [
    DrawerComponent,
    TopAppBarComponent,
    ViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    DrawerComponent,
    TopAppBarComponent,
    ViewComponent,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
