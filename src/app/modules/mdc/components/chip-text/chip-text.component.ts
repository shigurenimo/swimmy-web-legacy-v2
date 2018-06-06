import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-chip-text]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./chip-text.component.scss']
})
export class ChipTextComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-chip__text');
  }
}
