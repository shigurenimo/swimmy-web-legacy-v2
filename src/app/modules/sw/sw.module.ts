import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderComponent } from './components/loader/loader.component';

import { TextFieldErrorComponent } from './components/text-field-error/text-field-error.component';
import { UtilsService } from './services/utils.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    LoaderComponent,
    TextFieldErrorComponent,
  ],
  declarations: [
    LoaderComponent,
    TextFieldErrorComponent,
  ],
  providers: [
    UtilsService,
  ],
})
export class SwModule {
}
