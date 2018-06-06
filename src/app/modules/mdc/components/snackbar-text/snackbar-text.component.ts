import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-snackbar-text]',
  template: `
    <p>
      snackbar-text works!
    </p>
  `,
  styleUrls: ['./snackbar-text.component.scss']
})
export class SnackbarTextComponent implements OnInit {
  constructor (private elementRef: ElementRef) { }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-snackbar__text');
  }
}
