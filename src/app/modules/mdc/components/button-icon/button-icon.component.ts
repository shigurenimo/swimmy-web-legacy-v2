import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-button-icon]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./button-icon.component.scss']
})
export class ButtonIconComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-button__icon');
    this.elementRef.nativeElement.classList.add('material-icons');
  }
}
