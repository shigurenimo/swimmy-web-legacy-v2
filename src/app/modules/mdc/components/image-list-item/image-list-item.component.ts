import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-image-list-item]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./image-list-item.component.scss']
})
export class ImageListItemComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-image-list__item');
  }
}
