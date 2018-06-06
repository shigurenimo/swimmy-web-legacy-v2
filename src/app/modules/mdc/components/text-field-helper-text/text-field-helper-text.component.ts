import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { MDCTextFieldHelperText } from '@material/textfield/helper-text';

@Component({
  selector: '[mdc-text-field-helper-text]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./text-field-helper-text.component.scss'],
})
export class TextFieldHelperTextComponent implements OnInit, AfterContentInit, OnDestroy {
  public helperText;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-text-field-helper-text');
  }

  ngAfterContentInit() {
    this.helperText = new MDCTextFieldHelperText(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.helperText.destroy();
  }
}
