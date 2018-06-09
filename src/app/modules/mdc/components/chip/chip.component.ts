import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-chip]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-chip');
  }
}
