import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-tab-icon-text]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./tab-icon-text.component.scss'],
})
export class TabIconTextComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-tab-icon-text');
  }
}
