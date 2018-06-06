import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-tab-bar]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent implements OnInit {
  @Input() withIconAndText: string;

  constructor (
    private elementRef: ElementRef,
    private utils: UtilsService,
  ) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-tab-bar');

    if (this.utils.toBool(this.withIconAndText)) {
      this.elementRef.nativeElement.classList.add('mdc-tab-bar--with-icon-and-text');
    }
  }
}
