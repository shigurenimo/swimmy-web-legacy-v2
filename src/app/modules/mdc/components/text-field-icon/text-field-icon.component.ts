import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { MDCTextFieldIcon } from '@material/textfield/icon';

@Component({
  selector: '[mdc-text-field-icon]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./text-field-icon.component.scss'],
})
export class TextFieldIconComponent implements OnInit, OnDestroy, AfterContentInit {
  public textFieldIcon;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-text-field__icon');
    this.elementRef.nativeElement.classList.add('material-icons');
  }

  ngOnDestroy() {
    this.textFieldIcon.destroy();
  }

  ngAfterContentInit() {
    this.textFieldIcon = new MDCTextFieldIcon(this.elementRef.nativeElement);
  }
}
