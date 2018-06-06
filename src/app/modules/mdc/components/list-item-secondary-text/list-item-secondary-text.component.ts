import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-list-item-secondary-text]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./list-item-secondary-text.component.scss']
})
export class ListItemSecondaryTextComponent implements OnInit {
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-list-item__secondary-text');
  }
}
