import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-notched-outline-idle]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./notched-outline-idle.component.scss'],
})
export class NotchedOutlineIdleComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-notched-outline__idle');
  }
}
