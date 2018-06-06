import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-icon]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('material-icons');
  }
}
