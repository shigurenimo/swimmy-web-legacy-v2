import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
    HttpClientModule,
    ReactiveFormsModule,
    SwModule,
    MdcModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MdcModule,
    SwModule,
    ResizePipe,
  ],
})
export class SharedModule {
}
