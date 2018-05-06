import { Location } from '@angular/common';
import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-header',
  template: `
    <div class='header'>
      <div class='row' nz-row nzType='flex' nzAlign='middle' *ngIf='goBack'>
        <span nz-col class='user'>
          <button nz-button nzShape='circle' nzSize='large' (click)='onGoBack()'>
            <span class='anticon anticon-left'></span>
          </button>
        </span>

        <span>
          <span class='center'>
            <ng-template [ngTemplateOutlet]='title'></ng-template>
          </span>
        </span>
      </div>

      <div class='menu row' nz-row nzType='flex' nzAlign='middle' *ngIf='!goBack'>
        <ul nz-menu nzMode='horizontal'>
          <li *ngFor='let link of links'
            nz-menu-item
            [routerLink]='link.routerLink'
            [routerLinkActiveOptions]='routerLinkActiveOptions'
            routerLinkActive='ant-menu-item-selected'>
            <span [class]='link.iconClass'></span>
          </li>
          <li
            *ngIf='uid'
            nz-menu-item
            routerLink='/{{username}}'
            [routerLinkActiveOptions]='routerLinkActiveOptions'
            routerLinkActive='ant-menu-item-selected'>
            <span class='anticon anticon-user'></span>
          </li>
        </ul>
        <span class='flex-space'></span>
        <span nz-col class='user' routerLink='/settings' *ngIf='uid'>
        <button nz-button nzShape='circle' nzSize='large'>
          <span class='anticon anticon-setting'></span>
        </button>
        </span>
        <span nz-col class='user' routerLink='/login' *ngIf='!uid'>
          <button nz-button nzShape='circle' nzSize='large'>
            <span class='anticon anticon-poweroff'></span>
          </button>
        </span>
      </div>
    </div>

    <div class='body'>
      <ng-template [ngTemplateOutlet]='body'></ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .header {
      width: 100%;
      background: white;
    }

    @media screen and (min-width: 769px) {
      .menu {
        display: none;
      }
    }

    .row {
      height: 48px;
    }

    .ant-menu-item ::ng-deep .anticon {
      font-size: 16px;
      vertical-align: middle;
    }

    @media screen and (max-width: 768px) {
      .ant-menu-item ::ng-deep .anticon {
        margin-right: 0;
      }

      .name {
        display: none;
      }
    }

    .center {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      line-height: 48px;
      height: 48px;
      width: 200px;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
    }

    .user {
      margin: 0 10px 0 10px;
    }

    .user ::ng-deep .ant-btn {
      border: none;
    }

    .header-space {
      height: 48px;
    }

    .flex-space {
      flex: 1 1 auto;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() goBack;
  @ContentChild('title') title: TemplateRef<void>;
  @ContentChild('body') body: TemplateRef<void>;

  public routerLinkActiveOptions = {
    exact: true
  };
  public links = [
    {
      routerLink: ['/'],
      iconClass: 'anticon anticon-home'
    } /*, {
      routerLink: ['/images'],
      iconClass: 'anticon anticon-camera'
    }, {
      routerLink: ['/threads'],
      iconClass: 'anticon anticon-message'
    }
    */
  ];
  public uid = null;
  public username = null;

  private authState$$ = null;

  constructor (
    public afAuth: AngularFireAuth,
    private location: Location) {
  }

  public onGoBack () {
    this.location.back();
  }

  ngOnInit () {
    this.authState$$ = this.afAuth.authState.subscribe((next) => {
      this.onChangeAuthState(next);
    });
  }

  ngOnDestroy () {
    this.authState$$.unsubscribe();
  }

  private onChangeAuthState (user) {
    if (user) {
      this.uid = user.uid;
      this.username = user.email.replace('@swimmy.io', '');
    } else {
      this.uid = null;
    }
  }
}
