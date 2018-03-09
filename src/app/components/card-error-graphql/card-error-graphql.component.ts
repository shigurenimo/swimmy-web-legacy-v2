import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-error-graphql',
  templateUrl: './card-error-graphql.component.html',
  styleUrls: ['./card-error-graphql.component.css']
})
export class CardErrorGraphqlComponent implements OnInit {
  @Input() errors;

  constructor () { }

  ngOnInit () {
  }

}
