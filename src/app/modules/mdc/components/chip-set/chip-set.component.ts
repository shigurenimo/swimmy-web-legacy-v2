import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { MDCChipSet } from '@material/chips';

@Component({
  selector: '[mdc-chip-set]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./chip-set.component.scss']
})
export class ChipSetComponent implements OnInit, OnDestroy, AfterContentInit {
  public chipSet;

  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-chip-set');
  }

  ngAfterContentInit () {
    this.chipSet = new MDCChipSet(this.elementRef.nativeElement);
  }

  ngOnDestroy () {
    this.chipSet.destroy();
  }
}
