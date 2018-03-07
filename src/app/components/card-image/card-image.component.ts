import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.css']
})
export class CardImageComponent implements OnInit {
  @Input() id: string;
  @Input() photoURLs: string[];
  @Input() createdAt: string;

  public resize = 'image';
  public resizeReplica = 'replica'
  public date = 'yyyy年MM月dd日'

  constructor () { }

  ngOnInit () {
  }
}
