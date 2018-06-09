import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-list-item]',
  preserveWhitespaces: false,
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() activated: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-list-item');
    if (this.activated) {
      this.elementRef.nativeElement.classList.add('mdc-list-item--activated');
    }
  }
}
