import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserService } from '../../services/browser.service';

import { DrawerService } from '../../services/drawer.service';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-top-app-bar',
  template: `
    <header mdc-top-app-bar>
      <div mdc-top-app-bar-row>
        <section mdc-top-app-bar-section alignStart>
          <ng-container *ngIf='isTemporary'>
            <a mdc-top-app-bar-navigation-icon (click)='onToggleDrawer()'>menu</a>
          </ng-container>
          <span mdc-top-app-bar-title>{{appTitle}}</span>
        </section>
        <section mdc-top-app-bar-section alignEnd>
          <a
            mdc-top-app-bar-action-item
            aria-label="scroll top"
            alt="scroll top"
            (click)='onScrollTop()'
          >
            keyboard_arrow_up
          </a>
        </section>
      </div>
    </header>

    <ng-content></ng-content>
  `,
  styleUrls: ['./top-app-bar.component.scss'],
})
export class TopAppBarComponent implements OnInit, AfterContentInit {
  public appTitle = '';

  public get isTemporary() {
    return this.windowService.width < 768;
  }

  constructor(
    private router: Router,
    private drawerService: DrawerService,
    private windowService: WindowService,
    private browser: BrowserService,
  ) {
  }

  public ngOnInit() {
    this.browser.getAppTitle().subscribe(value => {
      this.appTitle = value;
    });
  }

  public ngAfterContentInit() {
  }

  public onToggleDrawer() {
    this.drawerService.toggle();
  }

  public onScrollTop() {
    window.scrollTo(0, 0);
  }
}
