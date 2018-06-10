import { Component, Input } from '@angular/core';
import { Post } from '../../../../interfaces/post';

@Component({
  selector: 'app-card-image',
  template: `
    <ng-container *ngFor='let photoURL of post.photoURLs'>
      <div mdc-card>
        <img mdc-card-media [src]='photoURL|resize:resize'>
      </div>
    </ng-container>
  `,
  styleUrls: ['card-image.component.scss'],
})
export class CardImageComponent {
  @Input() post: Post;

  public resize = 'image';
}
