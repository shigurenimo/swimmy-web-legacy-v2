import { Location } from '@angular/common';
import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-header',
  template: `
    <div class='header'>
      <div class='row' nz-row nzType='flex' nzAlign='middle' *ngIf='goBack'>
        <span nz-col class='user'>
          <button nz-button nzShape='circle' (click)='onGoBack()'>
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
        <button nz-button nzShape='circle'>
          <span class='anticon anticon-setting'></span>
        </button>
        </span>
        <span nz-col class='user' routerLink='/login' *ngIf='!uid'>
          <button nz-button nzShape='circle'>
            <span class='anticon anticon-poweroff'></span>
          </button>
        </span>
      </div>
    </div>

    <div class='body'>
      <ng-template [ngTemplateOutlet]='body'></ng-template>
    </div>
  `,
  styleUrls: ['header.component.scss']
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
    }, {
      routerLink: ['/images'],
      iconClass: 'anticon anticon-camera'
    }, {
      routerLink: ['/threads'],
      iconClass: 'anticon anticon-message'
    }
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
