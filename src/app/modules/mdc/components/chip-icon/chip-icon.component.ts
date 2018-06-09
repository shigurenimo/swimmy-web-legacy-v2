import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-chip-icon]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./chip-icon.component.scss'],
})
export class ChipIconComponent implements OnInit {
  @Input() leading: string;
  @Input() 'material-icons': string;

  constructor(
    private elementRef: ElementRef,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-chip__icon');

    if (this.utilsService.toBool(this.leading)) {
      this.elementRef.nativeElement.classList.add('mdc-chip__icon--leading');
    }

    if (this.utilsService.toBool(this['material-icons'])) {
      this.elementRef.nativeElement.classList.add('material-icons');
    }
  }
}
