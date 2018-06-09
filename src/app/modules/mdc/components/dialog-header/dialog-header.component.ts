import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-dialog-header]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog-header.component.scss'],
})
export class DialogHeaderComponent implements OnInit {

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-dialog__header');
  }

}
