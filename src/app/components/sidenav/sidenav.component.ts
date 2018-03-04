import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  public nzTheme = 'white';

  public nzMode = 'inline';

  public routerLinkActiveOptions = {
    exact: true
  };

  public links = [
    {path: '/', icon: 'anticon anticon-home'}
  ];

  constructor(
    public afAuth: AngularFireAuth) {
  }
}
