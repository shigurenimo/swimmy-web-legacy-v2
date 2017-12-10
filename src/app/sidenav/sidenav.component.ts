import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  public links = [
    {path: '/login', icon: 'account_circle'},
    {path: '/', icon: 'home'},
    {path: '/config', icon: 'settings'},
    {path: '/info', icon: 'info'}
  ];
}
