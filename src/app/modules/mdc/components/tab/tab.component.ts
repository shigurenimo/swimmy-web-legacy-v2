import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-tab]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-tab');
  }
}
