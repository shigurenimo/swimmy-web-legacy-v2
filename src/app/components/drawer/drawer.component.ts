import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DrawerComponent as MdcDrawerComponent } from '../../modules/mdc/components/drawer/drawer.component';
import { AuthService } from '../../services/auth.service';
import { DrawerService } from '../../services/drawer.service';
import { WindowService } from '../../services/window.service';

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
              {{link.name}}
            </a>
          </ng-container>
          <ng-container *ngIf="authService.currentUser">
            <a
              mdc-list-item
              [routerLinkActiveOptions]='routerLinkActiveOptions'
              routerLink='/settings'
              routerLinkActive='activated'
            >
              <i mdc-list-item-graphic material-icons>settings</i>
              設定
            </a>
          </ng-container>
          <ng-container *ngIf="!authService.currentUser">
            <a
              mdc-list-item
              [routerLinkActiveOptions]='routerLinkActiveOptions'
              routerLink='/login'
              routerLinkActive='activated'
            >
              <i mdc-list-item-graphic material-icons>perm_identity</i>
              ログイン
            </a>
          </ng-container>
        </nav>
      </div>
    </ng-template>
  `,
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit, OnDestroy, AfterViewInit {

  public uid = null;
  public username = null;
  public routerLinkActiveOptions = {
    exact: true,
  };
  public links = [{
    routerLink: ['/'],
    icon: 'home',
    name: 'タイムライン',
  }, {
    routerLink: ['/images'],
    icon: 'camera',
    name: '画像',
  }, {
    routerLink: ['/threads'],
    icon: 'message',
    name: 'スレッド',
  }];
  @ViewChild(MdcDrawerComponent)
  private drawerComponent: MdcDrawerComponent;
  private isOpen$$;
  private authState$$ = null;

  constructor(
    public authService: AuthService,
    public drawerService: DrawerService,
    private windowService: WindowService,
  ) {
  }

  public get isTemporary() {
    return this.windowService.width < 768;
  }

  public ngOnInit() {
    this.isOpen$$ = this.drawerService.isOpen$.subscribe(next => {
      this.drawerComponent.drawer.open = next;
    });

    this.authState$$ = this.authService.authState().subscribe((next) => {
      this.onChangeAuthState(next);
    });
  }

  public ngOnDestroy() {
    this.isOpen$$.unsubscribe();
    this.authState$$.unsubscribe();
  }

  public ngAfterViewInit() {
  }

  private onChangeAuthState(user) {
    if (user) {
      this.uid = user.uid;
      this.username = user.email.replace('@swimmy.io', '');
    } else {
      this.uid = null;
    }
  }
}
