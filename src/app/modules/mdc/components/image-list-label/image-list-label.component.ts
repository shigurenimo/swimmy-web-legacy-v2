import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-image-list-label]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./image-list-label.component.scss'],
})
export class ImageListLabelComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-image-list__label');
  }
}
