import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/index';

import { BrowserService } from '../../../../services/browser.service';
import { DrawerService } from '../../../../services/drawer.service';
import { WindowService } from '../../../../services/window.service';

@Component({
  selector: 'app-top-app-bar',
  template: `
    <header mdc-top-app-bar class="sw-top-app-bar">
      <div mdc-top-app-bar-row>
        <section mdc-top-app-bar-section alignStart>
          <ng-container *ngIf="isLeftActionType('menu')">
            <ng-container *ngIf='isTemporary'>
              <a mdc-top-app-bar-navigation-icon (click)='onToggleDrawer()'>menu</a>
            </ng-container>
          </ng-container>
          <ng-container *ngIf="isLeftActionType('return')">
            <a mdc-top-app-bar-navigation-icon (click)='onGoBack()'>undo</a>
          </ng-container>
          <span mdc-top-app-bar-title>{{appTitle$ | async}}</span>
        </section>
        <section mdc-top-app-bar-section alignEnd>
          <a
            mdc-top-app-bar-action-item
            aria-label="scroll top"
            alt="scroll top"
            (click)='onScrollTop()'
          >
            vertical_align_top
          </a>
        </section>
      </div>
    </header>

    <ng-content></ng-content>
  `,
  styleUrls: ['./top-app-bar.component.scss'],
})
export class TopAppBarComponent implements OnInit {
  public appTitle$: BehaviorSubject<string>;
  public leftActionType$: BehaviorSubject<string>;

  constructor(
    private location: Location,
    private router: Router,
    private drawerService: DrawerService,
    private windowService: WindowService,
    private browserService: BrowserService,
  ) {
  }

  public ngOnInit() {
    this.appTitle$ = this.browserService.getAppTitle();
    this.leftActionType$ = this.browserService.getLeftActionType();
  }

  public get isTemporary() {
    return this.windowService.width < 768;
  }

  public isLeftActionType(name) {
    return this.leftActionType$.getValue() === name;
  }

  public onToggleDrawer() {
    this.drawerService.toggle();
  }

  public onGoBack() {
    this.location.back();
  }

  public onScrollTop() {
    window.scrollTo(0, 0);
  }
}
