import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-top-app-bar-section]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./top-app-bar-section.component.scss']
})
export class TopAppBarSectionComponent implements OnInit {
  @Input() alignStart: string;
  @Input() alignEnd: string;

  constructor (
    private elementRef: ElementRef,
    private utils: UtilsService
  ) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-top-app-bar__section');

    if (this.utils.toBool(this.alignStart)) {
      this.elementRef.nativeElement.classList.add('mdc-top-app-bar__section--align-start');
    }
    if (this.utils.toBool(this.alignEnd)) {
      this.elementRef.nativeElement.classList.add('mdc-top-app-bar__section--align-end');
    }
  }
}
