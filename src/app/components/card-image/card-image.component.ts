import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-image',
  template: `
    <div class='card-frame'>
      <div class='card-image' *ngFor='let photoURL of photoURLs'>
        <img class='replica' [src]='photoURL|resize:resizeReplica'>
        <img class='image' [src]='photoURL|resize:resize'>
      </div>
    </div>

    <div nz-row nzType="flex" nzJustify="end">
      <span nz-col class="date">{{createdAt | date:date}}</span>
    </div>
  `,
  styleUrls: ['card-image.component.scss']
})
export class CardImageComponent {
  @Input() id: string;
  @Input() photoURLs: string[];
  @Input() createdAt: string;

  public resize = 'image';
  public resizeReplica = 'replica';
  public date = 'yyyy年MM月dd日';
}
