import { Component } from '@angular/core';

@Component({
  selector: '[sw-loader]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  constructor() {
  }
}
