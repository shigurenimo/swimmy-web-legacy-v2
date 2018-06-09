import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-card]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-card');
  }
}
