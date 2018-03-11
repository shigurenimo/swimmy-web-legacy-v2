import { Location } from '@angular/common';
import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // templates
  @Input() goBack;
  @ContentChild('title') title: TemplateRef<void>;
  @ContentChild('body') body: TemplateRef<void>;

  // ui state
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
    }];
  public uid = null;
  public username = null;

  // subscriptions
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
