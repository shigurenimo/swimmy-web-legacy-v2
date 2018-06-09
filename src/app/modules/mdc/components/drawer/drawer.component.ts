import { AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { MDCPersistentDrawer, MDCTemporaryDrawer } from '@material/drawer';

import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-drawer]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() persistent: string;
  @Input() temporary: string;

  public drawer;

  constructor(
    private elementRef: ElementRef,
    private utils: UtilsService,
  ) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-drawer');

    if (this.utils.toBool(this.persistent)) {
      this.elementRef.nativeElement.classList.add('mdc-drawer--persistent');
    }

    if (this.utils.toBool(this.temporary)) {
      this.elementRef.nativeElement.classList.add('mdc-drawer--temporary');
    }

    this.elementRef.nativeElement.classList.add('mdc-typography');
  }

  ngAfterContentInit() {
    if (this.utils.toBool(this.persistent)) {
      this.drawer = new MDCPersistentDrawer(this.elementRef.nativeElement);
      this.drawer.open = true;
    }

    if (this.utils.toBool(this.temporary)) {
      this.drawer = new MDCTemporaryDrawer(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.drawer.destroy();
  }
}
