import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-top-app-bar-navigation-icon]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./top-app-bar-navigation-icon.component.scss'],
})
export class TopAppBarNavigationIconComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-top-app-bar__navigation-icon');
    this.elementRef.nativeElement.classList.add('material-icons');
  }
}
