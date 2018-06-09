import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-image-list-supporting]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./image-list-supporting.component.scss'],
})
export class ImageListSupportingComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-image-list__supporting');
  }
}
