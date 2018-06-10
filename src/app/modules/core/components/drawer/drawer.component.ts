import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { DrawerService } from '../../../../services/drawer.service';
import { WindowService } from '../../../../services/window.service';
import { DrawerComponent as MdcDrawerComponent } from '../../../mdc/components/drawer/drawer.component';

@Component({
  selector: 'app-drawer',
  template: `
    <ng-container *ngIf='isTemporary'>
      <aside mdc-drawer temporary>
        <nav mdc-drawer-drawer>
          <div mdc-drawer-toolbar-spacer></div>
          <div mdc-drawer-content>
            <ng-container *ngTemplateOutlet="templateContent"></ng-container>
          </div>
        </nav>
      </aside>
    </ng-container>

    <ng-container *ngIf='!isTemporary'>
      <aside mdc-drawer persistent>
        <nav mdc-drawer-drawer>
          <div mdc-drawer-toolbar-spacer></div>
          <div mdc-drawer-content>
            <ng-container *ngTemplateOutlet="templateContent"></ng-container>
          </div>
        </nav>
      </aside>
    </ng-container>

    <ng-template #templateContent>
      <div mdc-drawer-content>
        <nav mdc-list>
          <ng-container *ngFor='let link of links'>
            <a
              mdc-list-item
              [routerLinkActiveOptions]='routerLinkActiveOptions'
              [routerLink]='link.routerLink'
              routerLinkActive='activated'
            >
              <i mdc-list-item-graphic material-icons>{{link.icon}}</i>
              <span mdc-list-item-text>{{link.text}}</span>
            </a>
          </ng-container>
          <ng-container *ngIf="authService.currentUser">
            <a
              mdc-list-item
              routerLink='/settings'
              routerLinkActive='activated'
            >
              <i mdc-list-item-graphic material-icons>settings</i>
              <span mdc-list-item-text>設定</span>
            </a>
          </ng-container>
          <ng-container *ngIf="!authService.currentUser">
            <a
              mdc-list-item
              routerLink='/login'
              routerLinkActive='activated'
            >
              <i mdc-list-item-graphic material-icons>perm_identity</i>
              <span mdc-list-item-text>ログイン</span>
            </a>
          </ng-container>
        </nav>
      </div>
    </ng-template>
  `,
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements AfterViewInit, OnDestroy {
  public routerLinkActiveOptions = {
    exact: true,
  };
  public links = [{
    routerLink: ['/'],
    icon: 'home',
    text: 'タイムライン',
  }, {
    routerLink: ['/storage'],
    icon: 'camera',
    text: 'ストレージ',
  }, {
    routerLink: ['/threads'],
    icon: 'message',
    text: 'スレッド',
  }];

  private isOpen$$;

  @ViewChild(MdcDrawerComponent)
  private drawerComponent: MdcDrawerComponent;

  constructor(
    public authService: AuthService,
    public drawerService: DrawerService,
    private windowService: WindowService,
  ) {
  }

  public ngAfterViewInit() {
    this.isOpen$$ = this.drawerService.isOpen$.subscribe(next => {
      this.drawerComponent.drawer.open = next;
    });
    this.drawerComponent.drawer.listen('click', () => {
      this.drawerService.close();
    });
  }

  public ngOnDestroy() {
    this.isOpen$$.unsubscribe();
  }

  public get isTemporary() {
    return this.windowService.width < 768;
  }
}
