import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { MatIconModule, MatListModule } from '@angular/material';

@NgModule({
  exports: [
    LayoutModule,
    MatIconModule,
    MatListModule
  ]
})
export class MaterialModule {
}
