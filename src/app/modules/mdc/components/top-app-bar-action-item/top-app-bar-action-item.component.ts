import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-top-app-bar-action-item]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./top-app-bar-action-item.component.scss']
})
export class TopAppBarActionItemComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-top-app-bar__action-item');
    this.elementRef.nativeElement.classList.add('material-icons');
  }
}
