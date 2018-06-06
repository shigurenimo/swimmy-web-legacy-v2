import { AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { MDCTopAppBar } from '@material/top-app-bar';

import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-top-app-bar]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./top-app-bar.component.scss']
})
export class TopAppBarComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() fixed: string;
  @Input() prominent: string;
  @Input() short: string;
  @Input() shortCollapsed: string;

  public topAppBar;

  constructor (
    private elementRef: ElementRef,
    private utils: UtilsService
  ) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-top-app-bar');

    if (this.utils.toBool(this.fixed)) {
      this.elementRef.nativeElement.classList.add('mdc-top-app-bar--fixed');
    }

    if (this.utils.toBool(this.prominent)) {
      this.elementRef.nativeElement.classList.add('mdc-top-app-bar--prominent');
    }

    if (this.utils.toBool(this.short)) {
      this.elementRef.nativeElement.classList.add('mdc-top-app-bar--short');
    }

    if (this.utils.toBool(this.shortCollapsed)) {
      this.elementRef.nativeElement.classList.add('mdc-top-app-bar--shortCollapsed');
    }
  }

  ngAfterContentInit () {
    this.topAppBar = new MDCTopAppBar(this.elementRef.nativeElement);
  }

  ngOnDestroy () {
    this.topAppBar.destroy()
  }
}
