import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../../../services/posts.service';

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
  constructor(private posts: PostsService) {
    console.log(this.posts);
  }

  ngOnInit() {
  }
}
