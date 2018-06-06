import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-text-field-input]',
  preserveWhitespaces: false,
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./text-field-input.component.scss']
})
export class TextFieldInputComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-text-field__input');
  }
}
