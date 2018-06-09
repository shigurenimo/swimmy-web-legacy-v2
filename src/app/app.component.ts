import { Component, HostListener } from '@angular/core';

import { WindowService } from './services/window.service';

@Component({
  selector: 'app-root',
  template: `
    <app-top-app-bar></app-top-app-bar>

    <sw-view>
      <router-outlet></router-outlet>
    </sw-view>

    <app-drawer></app-drawer>
  `,
})
export class AppComponent {
  constructor(private windowService: WindowService) {
  }

  @HostListener('window:resize', [])
  private onWindowResize() {
    this.windowService.updateWidth();
  }
}
