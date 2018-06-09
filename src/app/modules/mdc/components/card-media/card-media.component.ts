import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: '[mdc-card-media]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./card-media.component.scss'],
})
export class CardMediaComponent implements OnInit {
  @Input() outlined: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add('mdc-card-media');

    if (this.isEnabled('outlined')) {
      this.elementRef.nativeElement.classList.add('mdc-card-media--outlined');
    }
  }

  private isEnabled(name: string) {
    return this[name] === '' || this[name];
  }
}
