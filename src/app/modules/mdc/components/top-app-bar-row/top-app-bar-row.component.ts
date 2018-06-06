import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-top-app-bar-row]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./top-app-bar-row.component.scss']
})
export class TopAppBarRowComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-top-app-bar__row');
  }
}
