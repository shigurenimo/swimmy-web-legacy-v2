import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogComponent } from '../../modules/mdc/components/dialog/dialog.component';
import { AuthService } from '../../services/auth.service';
import { BrowserService } from '../../services/browser.service';

@Component({
  selector: 'app-view-settings',
  template: `
    <div *ngIf='!isLoadingQuery && isNotFound'>
      <p>ログインが必要です</p>
    </div>

    <ng-container *ngIf='!isLoadingQuery && !isNotFound'>
      <ul mdc-list two-line>
        <ng-container *ngFor='let item of list'>
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
    </ng-container>

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
  styleUrls: ['view-settings.component.scss'],
})
export class ViewSettingsComponent implements OnInit, OnDestroy {
  public displayName = null;
  public photoURL = null;
  public isLoadingQuery = true;
  public isNotFound = false;
  public list = [{
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
  private authState$$ = null;
  @ViewChild(DialogComponent)
  private dialogComponent: DialogComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private browser: BrowserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.authState$$ = this.authService.authState().subscribe((data) => {
      this.onAuthState(data);
    });
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  ngOnDestroy() {
    this.authState$$.unsubscribe();
  }

  public onLogoutModal() {
    const dialog = this.dialogComponent.dialog;

    dialog.show();
  }

  public onCancelLogout() {
    const dialog = this.dialogComponent.dialog;

    dialog.close();
  }

  public onLogout() {
    const dialog = this.dialogComponent.dialog;

    dialog.close();

    this.authService.auth.signOut().then(() => {
      return this.router.navigate(['/']);
    });
  }

  private onAuthState(user) {
    if (user) {
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
    } else {
      this.isNotFound = true;
    }
    this.isLoadingQuery = false;
  }
}
