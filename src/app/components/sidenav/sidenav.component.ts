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
    {path: '/', icon: 'anticon anticon-home'}
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
