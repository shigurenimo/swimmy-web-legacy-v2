import { AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { MDCTextField } from '@material/textfield';

@Component({
  selector: '[mdc-text-field]',
  preserveWhitespaces: false,
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() upgraded: string;
  @Input() box: string;
  @Input() outlined: string;
  @Input() fullwidth: string;
  @Input() textarea: string;
  @Input() disabled: string;
  @Input() withLeadingIcon: string;
  @Input() withTrailingIcon: string;
  @Input() dense: string;

  public textField;

  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-text-field');

    if (this.toBool(this.upgraded)) {
      this.elementRef.nativeElement.classList.add('mdc-text-field--upgraded');
    }
    if (this.toBool(this.box)) {
      this.elementRef.nativeElement.classList.add('mdc-text-field--box');
    }
    if (this.toBool(this.outlined)) {
      this.elementRef.nativeElement.classList.add('mdc-text-field--outlined');
    }
    if (this.toBool(this.fullwidth)) {
      this.elementRef.nativeElement.classList.add('mdc-text-field--fullwidth');
    }
    if (this.toBool(this.textarea)) {
      this.elementRef.nativeElement.classList.add('mdc-text-field--textarea');
    }
    if (this.toBool(this.disabled)) {
      this.elementRef.nativeElement.classList.add('mdc-text-field--disabled');
    }
    if (this.toBool(this.withLeadingIcon)) {
      this.elementRef.nativeElement.classList.add('mdc-text-field--with-leading-icon');
    }
    if (this.toBool(this.withTrailingIcon)) {
      this.elementRef.nativeElement.classList.add('mdc-text-field--with-trailing-icon');
    }
    if (this.toBool(this.dense)) {
      this.elementRef.nativeElement.classList.add('mdc-text-field--dense');
    }
  }

  ngAfterContentInit () {
    this.textField = new MDCTextField(this.elementRef.nativeElement);
  }

  ngOnDestroy () {
    this.textField.destroy()
  }

  private toBool (value: string) {
    return value === '' || value;
  }
}
