import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-notched-outline]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./notched-outline.component.scss'],
})
export class NotchedOutlineComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-notched-outline__outline');
  }
}
