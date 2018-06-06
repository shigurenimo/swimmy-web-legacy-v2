import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-elevation]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./elevation.component.scss']
})
export class ElevationComponent implements OnInit {
  @Input() public z1: string;
  @Input() public z2: string;
  @Input() public z3: string;
  @Input() public z4: string;
  @Input() public z5: string;
  @Input() public z6: string;
  @Input() public z7: string;
  @Input() public z8: string;
  @Input() public z9: string;
  @Input() public z10: string;
  @Input() public z11: string;
  @Input() public z12: string;
  @Input() public z13: string;
  @Input() public z14: string;
  @Input() public z15: string;
  @Input() public z16: string;
  @Input() public z17: string;
  @Input() public z18: string;
  @Input() public z19: string;
  @Input() public z20: string;
  @Input() public z21: string;
  @Input() public z22: string;
  @Input() public z23: string;
  @Input() public z24: string;

  constructor (
    private elementRef: ElementRef,
    private utils: UtilsService
  ) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-elevation');

    const numbers = [
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
      17, 18, 19, 20,
      21, 22, 23, 24
    ];

    numbers.forEach(n => {
      if (this.utils.toBool(this[`z${n}`])) {
        this.elementRef.nativeElement.classList.add(`mdc-elevation--z${n}`);
      }
    });
  }
}
