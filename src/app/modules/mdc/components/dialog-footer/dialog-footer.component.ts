import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-dialog-footer]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./dialog-footer.component.scss'],
})
export class DialogFooterComponent implements OnInit {

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-dialog__footer');
  }

}
