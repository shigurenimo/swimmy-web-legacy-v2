import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-drawer-drawer]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./drawer-drawer.component.scss'],
})
export class DrawerDrawerComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-drawer__drawer');
  }
}
