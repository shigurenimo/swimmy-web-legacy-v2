import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-list-item-text]',
  preserveWhitespaces: false,
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./list-item-text.component.scss'],
})
export class ListItemTextComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-list-item__text');
  }
}
