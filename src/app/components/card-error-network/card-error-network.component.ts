import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-error-network',
  templateUrl: './card-error-network.component.html',
  styleUrls: ['./card-error-network.component.css']
})
export class CardErrorNetworkComponent implements OnInit {
  @Input() error = null;

  constructor() { }

  ngOnInit() {
  }

}
