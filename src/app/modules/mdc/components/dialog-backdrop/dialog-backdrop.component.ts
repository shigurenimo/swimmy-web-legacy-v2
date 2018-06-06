import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-dialog-backdrop]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog-backdrop.component.scss']
})
export class DialogBackdropComponent implements OnInit {

  constructor (private elementRef: ElementRef) { }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-dialog__backdrop');
  }

}
