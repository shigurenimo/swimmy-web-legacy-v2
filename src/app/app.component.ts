import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isCollapsed = false;

  public nzBreakpoint = 'sm';

  public nzWidth = 64;

  constructor() {
  }
}
