import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-floating-label]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./floating-label.component.scss'],
})
export class FloatingLabelComponent implements OnInit {
  @Input() floatAbove: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-floating-label');

    if (this.toBool(this.floatAbove)) {
      this.elementRef.nativeElement.classList.add('mdc-floating-label--float-above');
    }
  }

  private toBool(value: string) {
    return value === '' || value;
  }
}
