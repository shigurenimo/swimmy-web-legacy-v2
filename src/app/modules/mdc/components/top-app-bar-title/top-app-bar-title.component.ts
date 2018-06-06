import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-top-app-bar-title]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./top-app-bar-title.component.scss']
})
export class TopAppBarTitleComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-top-app-bar__title');
  }
}
