import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-dialog-body]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog-body.component.scss'],
})
export class DialogBodyComponent implements OnInit {

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-dialog__body');
  }

}
