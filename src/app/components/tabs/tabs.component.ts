import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  template: `
    <nav mdc-tab-bar>
      <ng-container *ngFor='let link of links'>
        <a
          mdc-tab
          [routerLinkActiveOptions]='routerLinkActiveOptions'
          [routerLink]='link.routerLink'
          routerLinkActive='active'
        >
          <i mdc-tab-icon>home</i>
        </a>
      </ng-container>
    </nav>

    <ng-content></ng-content>
  `,
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  public routerLinkActiveOptions = {
    exact: true
  };

  public links = [{
    routerLink: ['/'],
    icon: 'home',
    text: 'タイムライン'
  }, {
    routerLink: ['/images'],
    icon: 'camera',
    text: '画像'
  }, {
    routerLink: ['/threads'],
    icon: 'message',
    text: 'スレッド'
  }, {
    routerLink: ['/settings'],
    icon: 'settings',
    text: '設定'
  }];

  constructor () { }

  ngOnInit () {
  }
}
