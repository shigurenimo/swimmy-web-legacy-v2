import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MdcModule } from '../mdc/mdc.module';
import { SwModule } from '../sw/sw.module';
import { ResizePipe } from './pipes/resize.pipe';

@NgModule({
  declarations: [
    ResizePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SwModule,
    MdcModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdcModule,
    SwModule,
    ResizePipe,
  ],
})
export class SharedModule {
}
