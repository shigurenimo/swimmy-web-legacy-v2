import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-image-list]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit {
  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-image-list');
  }
}
