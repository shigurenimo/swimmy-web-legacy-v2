import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-info',
  template: `
    <p>
      feature.hello > home
    </p>

    <button mdc-button></button>
  `,
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
