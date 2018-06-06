import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-typography]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent implements OnInit {
  @Input() headline1: string;
  @Input() headline2: string;
  @Input() headline3: string;
  @Input() headline4: string;
  @Input() headline5: string;
  @Input() headline6: string;
  @Input() subtitle1: string;
  @Input() subtitle2: string;
  @Input() body1: string;
  @Input() body2: string;
  @Input() caption: string;
  @Input() button: string;
  @Input() overline: string;

  constructor (
    private elementRef: ElementRef,
    private utils: UtilsService
  ) {
  }

  ngOnInit () {
    this.elementRef.nativeElement.classList.add('mdc-typography');

    if (this.utils.toBool(this.headline1)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--headline1');
    } else if (this.utils.toBool(this.headline2)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--headline2');
    } else if (this.utils.toBool(this.headline3)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--headline3');
    } else if (this.utils.toBool(this.headline4)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--headline4');
    } else if (this.utils.toBool(this.headline5)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--headline5');
    } else if (this.utils.toBool(this.headline6)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--headline6');
    } else if (this.utils.toBool(this.body1)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--body1');
    } else if (this.utils.toBool(this.body2)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--body2');
    } else if (this.utils.toBool(this.caption)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--caption');
    } else if (this.utils.toBool(this.button)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--button');
    } else if (this.utils.toBool(this.overline)) {
      this.elementRef.nativeElement.classList.add('mdc-typography--overline');
    }
  }
}
