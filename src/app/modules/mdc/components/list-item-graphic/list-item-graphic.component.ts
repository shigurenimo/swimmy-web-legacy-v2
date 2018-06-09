import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-list-item-graphic]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./list-item-graphic.component.scss'],
})
export class ListItemGraphicComponent implements OnInit {
  @Input() 'material-icons': string;

  constructor(
    private elementRef: ElementRef,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-list-item__graphic');

    if (this.utilsService.toBool(this['material-icons'])) {
      this.elementRef.nativeElement.classList.add('material-icons');
    }
  }
}
