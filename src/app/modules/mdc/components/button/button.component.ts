import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-button]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() raised: string;
  @Input() unelevated: string;
  @Input() outlined: string;
  @Input() dense: string;

  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-button');

    if (this.toBool(this.raised)) {
      this.elementRef.nativeElement.classList.add('mdc-button--raised');
    }
    if (this.toBool(this.unelevated)) {
      this.elementRef.nativeElement.classList.add('mdc-button--unelevated');
    }
    if (this.toBool(this.outlined)) {
      this.elementRef.nativeElement.classList.add('mdc-button--outlined');
    }
    if (this.toBool(this.dense)) {
      this.elementRef.nativeElement.classList.add('mdc-button--dense');
    }
  }

  private toBool (value: string) {
    return value === '' || value;
  }
}
