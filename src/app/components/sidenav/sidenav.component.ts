import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  // ui states
  public nzTheme = 'white';
  public nzMode = 'inline';
  public uid = null;
  public username = null;

  // subscriptions
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

  constructor(
    public afAuth: AngularFireAuth) {
  }

  private onChangeAuthState (user) {
    if (user) {
      this.uid = user.uid;
      this.username = user.email.replace('@swimmy.io', '')
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
