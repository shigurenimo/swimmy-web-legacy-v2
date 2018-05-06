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
  styles: [`
    :host {
      display: block;
      padding-top: 80px;
      padding-bottom: 80px;
      margin: 0 auto;
      width: 100%;
      max-width: 500px;
    }

    .card-frame {
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .card-image {
      position: relative;
      width: 100%;
      overflow: hidden;
      background: gray;
    }

    .card-image .replica {
      filter: blur(40px);
    }

    .card-image .image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .card-image img {
      display: block;
      width: 100%;
    }
  `]
})
export class CardImageComponent {
  @Input() id: string;
  @Input() photoURLs: string[];
  @Input() createdAt: string;

  public resize = 'image';
  public resizeReplica = 'replica';
  public date = 'yyyy年MM月dd日';
}
