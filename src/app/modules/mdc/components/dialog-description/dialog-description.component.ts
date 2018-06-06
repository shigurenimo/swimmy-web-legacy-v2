import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-dialog-description]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog-description.component.scss']
})
export class DialogDescriptionComponent implements OnInit {

  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-dialog-description');
  }

}
