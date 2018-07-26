import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { from } from 'rxjs/internal/observable/from';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from '../../../../services/auth.service';
import { BrowserService } from '../../../../services/browser.service';
import { DataLayerService } from '../../../../services/data-layer.service';
import { DialogComponent } from '../../../mdc/components/dialog/dialog.component';

@Component({
  selector: 'app-view-home',
  template: `
    <ul mdc-list two-line>
      <ng-container *ngFor='let item of links'>
        <li mdc-list-item [routerLink]='item.routerLink'>
          <i mdc-list-item-graphic material-icons>{{item.icon}}</i>
          <span mdc-list-item-text>
          {{item.text}}
          <span mdc-list-item-secondary-text>
            {{item.secondaryText}}
          </span>
        </span>
        </li>
        <li mdc-list-divider></li>
      </ng-container>
      <li mdc-list-item (click)='onLogoutModal()'>
        <i mdc-list-item-graphic material-icons>pause</i>
        <span mdc-list-item-text>
          ログアウト
          <span mdc-list-item-secondary-text>
            ログアウトします。
          </span>
        </span>
      </li>
      <li mdc-list-divider></li>
    </ul>

    <aside mdc-dialog>
      <div mdc-dialog-surface>
        <header mdc-dialog-header>
          <h2 mdc-dialog-header-title>ログアウトしますか？</h2>
        </header>
        <section mdc-dialog-body>
          <p>
            やめる場合は「キャンセル」をタップしてください。
          </p>
        </section>
        <footer mdc-dialog-footer>
          <button mdc-dialog-footer-button accept (click)='onCancelLogout()'>キャンセル</button>
          <button mdc-dialog-footer-button cancel (click)='onLogout()'>ログアウト</button>
        </footer>
      </div>
      <div mdc-dialog-backdrop></div>
    </aside>
  `,
  styleUrls: ['view-home.component.scss'],
})
export class ViewHomeComponent implements OnInit {
  public links: { routerLink: string, icon: string, text: string, secondaryText: string }[];

  @ViewChild(DialogComponent)
  private dialogComponent: DialogComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private browserService: BrowserService,
    private activatedRoute: ActivatedRoute,
    private dataLayerService: DataLayerService,
  ) {
  }

  public ngOnInit() {
    this.links = [{
      routerLink: '/settings/profile',
      icon: 'perm_identity',
      text: 'プロフィール',
      secondaryText: 'アイコンの変更など。',
    }, {
      routerLink: '/settings/username',
      icon: 'dns',
      text: 'ユーザネーム',
      secondaryText: 'ログイン時に使用するユーザネームを変更する。',
    }, {
      routerLink: '/settings/password',
      icon: 'https',
      text: 'パスワード',
      secondaryText: 'ログイン時に使用するパスワードを変更する。',
    }];

    const snapshot = this.activatedRoute.snapshot;
    this.browserService.updateAppUIFromSnapshot(snapshot);
    this.browserService.updateHtmlFromSnapshot(snapshot);
    this.dataLayerService.pushPage();
  }

  public onLogoutModal() {
    this.dialogComponent.dialog.show();
  }

  public onCancelLogout() {
    this.dialogComponent.dialog.close();
  }

  public onLogout() {
    this.dialogComponent.dialog.close();

    const signOut$ = this.authService.signOut().pipe(
      mergeMap(() => {
        return from(this.router.navigate(['/']));
      }),
    );

    signOut$.subscribe(null, (err) => {
      console.error(err);
    });
  }
}
