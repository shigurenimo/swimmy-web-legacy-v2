import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  public links = [
    {path: '/', icon: 'home'},
    {path: '/config', icon: 'settings'},
    {path: '/info', icon: 'info'}
  ];

  constructor(public afAuth: AngularFireAuth) {
  }
}
