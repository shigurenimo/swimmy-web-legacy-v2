import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-dialog-header-title]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog-header-title.component.scss']
})
export class DialogHeaderTitleComponent implements OnInit {

  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-dialog__header__title');
  }

}
