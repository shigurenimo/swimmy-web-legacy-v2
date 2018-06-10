import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[mdc-theme-primary]',
})
export class ThemePrimaryDirective {
  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.classList.add('mdc-theme-primary');
  }
}
