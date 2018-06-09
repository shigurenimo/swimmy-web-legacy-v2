import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-dialog-label]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog-label.component.scss'],
})
export class DialogLabelComponent implements OnInit {

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-dialog-label');
  }

}
