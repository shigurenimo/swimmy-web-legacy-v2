import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-line-ripple]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./line-ripple.component.scss']
})
export class LineRippleComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-line-ripple');
  }
}
