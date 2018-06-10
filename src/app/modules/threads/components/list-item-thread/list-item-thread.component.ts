import { Component, Input, OnInit } from '@angular/core';

import { Post } from '../../../../interfaces/post';

@Component({
  selector: 'app-list-item-thread',
  template: `
    <li mdc-list-item routerLink="/posts/{{post.id}}">
      <ng-container *ngIf="post.content">
        <span mdc-list-item-text>
          <span class="count">+ {{post.repliedPostCount}}</span>
          <span>{{post.content}}</span>
          <span mdc-list-item-secondary-text>{{post.updatedAt | date:date}}</span>
        </span>
      </ng-container>
      <ng-container *ngIf="!post.content">
        <span mdc-list-item-text>
          <span class="count">{{post.repliedPostCount}}</span>
          <span>無名スレッド</span>
          <span mdc-list-item-secondary-text>{{post.updatedAt | date:date}}</span>
        </span>
      </ng-container>
    </li>
  `,
  styleUrls: ['./list-item-thread.component.scss'],
})
export class ListItemThreadComponent implements OnInit {
  @Input() post: Post;

  public date = 'yyyy年MM月dd日';

  constructor() {
  }

  ngOnInit() {
  }
}
