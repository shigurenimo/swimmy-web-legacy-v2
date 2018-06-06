import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-dialog-surface]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog-surface.component.scss']
})
export class DialogSurfaceComponent implements OnInit {

  constructor (private elementRef: ElementRef) { }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-dialog__surface');
  }

}
