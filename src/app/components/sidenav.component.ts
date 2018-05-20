import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-sidenav',
  template: `
    <ul nz-menu [nzTheme]='nzTheme' [nzMode]='nzMode' nzInlineIndent='16'>
      <li *ngIf='uid'
        nz-menu-item
        [routerLinkActiveOptions]='routerLinkActiveOptions'
        routerLinkActive='ant-menu-item-selected'
        routerLink='/settings'>
        <span class='anticon anticon-setting'></span>
      </li>
      <li *ngIf='uid'
        nz-menu-item
        class='auth'
        [routerLinkActiveOptions]='routerLinkActiveOptions'
        routerLinkActive='ant-menu-item-selected'
        routerLink='/{{username}}'>
        <span class='anticon anticon-user'></span>
      </li>
      <li *ngIf='!(uid)'
        nz-menu-item
        class='auth'
        [routerLinkActiveOptions]='routerLinkActiveOptions'
        routerLinkActive='ant-menu-item-selected'
        routerLink='/login'>
        <span class='anticon anticon-poweroff'></span>
      </li>
      <li *ngFor='let link of links'
        nz-menu-item
        [routerLinkActiveOptions]='routerLinkActiveOptions'
        routerLinkActive='ant-menu-item-selected'
        [routerLink]='link.routerLink'>
        <span [class]='link.iconClass'></span>
      </li>
    </ul>
  `,
  styles: [`
    :host {
      display: block;
    }

    .ant-menu-item {
      text-align: center;
    }

    .ant-menu-item:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .auth {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .ant-menu-inline, .ant-menu-vertical {
      border-right: none
    }

    .ant-menu-item .anticon {
      font-size: 16px;
      margin-right: 0;
    }
  `]
})
export class SidenavComponent {
  public nzTheme = 'white';
  public nzMode = 'inline';
  public uid = null;
  public username = null;

  private authState$$ = null;

  public routerLinkActiveOptions = {
    exact: true
  };

  public links = [
    {
      routerLink: ['/'],
      iconClass: 'anticon anticon-home'
    }, {
      routerLink: ['/images'],
      iconClass: 'anticon anticon-camera'
    }, {
      routerLink: ['/threads'],
      iconClass: 'anticon anticon-message'
    }
  ];

  constructor (
    public afAuth: AngularFireAuth) {
  }

  private onChangeAuthState (user) {
    if (user) {
      this.uid = user.uid;
      this.username = user.email.replace('@swimmy.io', '');
    } else {
      this.uid = null;
    }
  }

  ngOnInit () {
    this.authState$$ = this.afAuth.authState.subscribe((next) => {
      this.onChangeAuthState(next);
    });
  }

  ngOnDestroy () {
    this.authState$$.unsubscribe();
  }
}
