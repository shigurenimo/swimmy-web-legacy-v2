import { Component } from '@angular/core';

@Component({
  selector: 'sw-view',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  constructor() {
  }
}
