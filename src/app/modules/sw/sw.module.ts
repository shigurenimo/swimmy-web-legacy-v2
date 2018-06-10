import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextFieldErrorComponent } from './components/text-field-error/text-field-error.component';
import { UtilsService } from './services/utils.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    TextFieldErrorComponent,
  ],
  declarations: [
    TextFieldErrorComponent,
  ],
  providers: [
    UtilsService,
  ],
})
export class SwModule {
}
