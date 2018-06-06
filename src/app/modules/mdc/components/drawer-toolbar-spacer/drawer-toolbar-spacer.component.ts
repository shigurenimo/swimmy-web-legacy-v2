import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-drawer-toolbar-spacer]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./drawer-toolbar-spacer.component.scss']
})
export class DrawerToolbarSpacerComponent implements OnInit {
  constructor (private elementRef: ElementRef) { }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-drawer__toolbar-spacer');
  }
}
