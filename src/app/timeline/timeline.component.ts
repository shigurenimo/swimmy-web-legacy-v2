import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Post } from '../models/Post';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {
  @Input() docs$: Observable<Post[]>;
  @Input() loading$: Observable<boolean>;

  constructor() {
    setTimeout(() => {
      console.log(this.docs$);
    }, 100);
  }
}
