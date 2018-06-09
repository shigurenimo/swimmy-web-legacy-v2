import { AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { MDCSnackbar, MDCSnackbarFoundation } from '@material/snackbar';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-snackbar]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit, AfterContentInit, OnDestroy {
  snackbar;

  @Input() 'align-start': string;

  constructor(
    private elementRef: ElementRef,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-snackbar');
  }

  ngAfterContentInit() {
    this.snackbar = new MDCSnackbar(this.elementRef.nativeElement);

    if (this.utilsService.toBool(this['align-start'])) {
      this.elementRef.nativeElement.classList.add('mdc-snackbar--align-start');
    }
  }

  ngOnDestroy() {
    this.snackbar.destroy();
  }
}
