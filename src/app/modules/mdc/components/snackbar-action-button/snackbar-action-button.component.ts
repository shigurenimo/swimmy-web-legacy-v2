import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-snackbar-action-button]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./snackbar-action-button.component.scss'],
})
export class SnackbarActionButtonComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-snackbar__action-button');
  }
}
