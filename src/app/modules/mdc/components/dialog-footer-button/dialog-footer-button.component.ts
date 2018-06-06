import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-dialog-footer-button]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog-footer-button.component.scss']
})
export class DialogFooterButtonComponent implements OnInit {

  @Input() accept: string;
  @Input() cancel: string;

  constructor (
    private elementRef: ElementRef,
    private utilsService: UtilsService
    ) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-dialog__footer__button');
    this.elementRef.nativeElement.classList.add('mdc-button');

    if (this.utilsService.toBool(this.accept)) {
      this.elementRef.nativeElement.classList.add('mdc-dialog__footer__button--accept');
    } else if (this.utilsService.toBool(this.cancel)) {
      this.elementRef.nativeElement.classList.add('mdc-dialog__footer__button--cancel');
    }
  }

}
