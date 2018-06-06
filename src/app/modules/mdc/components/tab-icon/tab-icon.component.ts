import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-tab-icon]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./tab-icon.component.scss']
})
export class TabIconComponent implements OnInit {
  constructor (private elementRef: ElementRef) { }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-tab__icon');
    this.elementRef.nativeElement.classList.add('material-icons');
  }
}
