import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[sw-text-field-error]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./text-field-error.component.scss']
})
export class TextFieldErrorComponent {
  constructor() { }
}
