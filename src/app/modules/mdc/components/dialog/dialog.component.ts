import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { MDCDialog, MDCDialogFoundation, util } from '@material/dialog';

@Component({
  selector: '[mdc-dialog]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, AfterContentInit, OnDestroy {

  public dialog;

  constructor (private elementRef: ElementRef) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-dialog');
  }

  ngAfterContentInit () {
    this.dialog = new MDCDialog(this.elementRef.nativeElement);
  }

  ngOnDestroy () {
    this.dialog.destroy();
  }

}
