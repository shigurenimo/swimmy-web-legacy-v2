import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-drawer-content]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./drawer-content.component.scss'],
})
export class DrawerContentComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-drawer__content');
  }
}
