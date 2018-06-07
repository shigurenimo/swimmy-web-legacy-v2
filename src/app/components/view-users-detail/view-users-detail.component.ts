import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { BrowserService } from '../../services/browser.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-view-users-detail',
  template: `
    <div *ngIf="!isLoading">
      <div class='block-icon'>
        <div class='icon' mdc-elevation z2>
          <img [src]='user.photoURL' class='image'>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['view-users-detail.component.scss'],
})
export class ViewUsersDetailComponent implements OnInit, OnDestroy {
  private params$$;

  public user;
  public isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    public afAuth: AngularFireAuth,
    private browser: BrowserService,
  ) {
  }

  public ngOnInit() {
    this.params$$ = this.activatedRoute.params.subscribe((params) => {
      this.onChangeParams(params);
    });
    this.browser.updateSnapshot(this.activatedRoute.snapshot);
  }

  public ngOnDestroy() {
    if (this.params$$) {
      this.params$$.unsubscribe();
    }
  }

  private onCatchError(err) {
  }

  private onChangeUser(user) {
    if (user) {
      console.log(user);
      this.user = user;
    }
    this.isLoading = false;
  }

  private onChangeParams(params) {
    const {username} = params;
    this.isLoading = true;
    const user$ = this.usersService.getUserByUsername(username);
    user$.subscribe((data) => {
      this.onChangeUser(data);
    }, (err) => {
      this.onCatchError(err);
    });
  }
}
