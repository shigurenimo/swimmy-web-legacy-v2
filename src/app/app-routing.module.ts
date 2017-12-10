import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewHomeComponent } from './view-home/view-home.component';

const routes: Routes = [
  {path: '', component: ViewHomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
