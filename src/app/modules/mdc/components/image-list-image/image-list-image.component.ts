import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: '[mdc-image-list-image]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./image-list-image.component.scss'],
})
export class ImageListImageComponent implements OnInit {
  @Input() imageAspectContainer: string;

  constructor(
    private elementRef: ElementRef,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-image-list__image');

    if (this.utilsService.toBool(this.imageAspectContainer)) {
      this.elementRef.nativeElement.classList.add('mdc-image-list__image-image-aspect-container');
    }
  }
}
