import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BrowserService } from '../../../../services/browser.service';
import { DataLayerService } from '../../../../services/data-layer.service';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'app-view-users-detail',
  template: `
    <ng-container *ngIf="!isLoading">
      <div>
        <div class='block-icon'>
          <div class='icon' mdc-elevation z2>
            <img [src]='user.photoURL' class='image'>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['view-detail.component.scss'],
})
export class ViewDetailComponent implements OnInit {
  public user;
  public isLoading = true;
  private params$$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private browserService: BrowserService,
    private dataLayerService: DataLayerService,
  ) {
  }

  public ngOnInit() {
    const snapshot = this.activatedRoute.snapshot;
    const {username} = snapshot.params;

    this.isLoading = true;

    const user$ = this.usersService.getUserByUsername(username);

    user$.subscribe((data) => {
      this.changeUser(data);
    }, () => {
    });

    this.browserService.updateAppUIFromSnapshot(snapshot);
    this.browserService.updateHtmlFromSnapshot(snapshot);
    this.dataLayerService.pushPage();
  }

  private changeUser(user) {
    if (user) {
      this.user = user;
    }
    this.isLoading = false;
  }
}
