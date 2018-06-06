import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-snackbar-action-wrapper]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./snackbar-action.component.scss']
})
export class SnackbarActionWrapperComponent implements OnInit {
  constructor (private elementRef: ElementRef) { }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-snackbar__action-wrapper');
  }
}
