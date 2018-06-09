import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-list]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() 'two-line': string;

  constructor(
    private elementRef: ElementRef,
    private utils: UtilsService,
  ) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-list');

    if (this.utils.toBool(this['two-line'])) {
      this.elementRef.nativeElement.classList.add('mdc-list--two-line');
    }
  }
}
