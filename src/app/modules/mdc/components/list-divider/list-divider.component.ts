import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-list-divider]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./list-divider.component.scss']
})
export class ListDividerComponent implements OnInit {

  constructor (private elementRef: ElementRef) { }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-list-divider');
  }

}
