import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-notched-outline-path]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./notched-outline-path.component.scss']
})
export class NotchedOutlinePathComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-notched-outline__path');
  }
}
