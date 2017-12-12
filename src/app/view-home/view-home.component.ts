import { Component } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { Post } from '../models/Post';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.css']
})
export class ViewHomeComponent {
  public col$: AngularFirestoreCollection<Post>;
  public docs$: Observable<Post[]>;

  constructor(private afs: AngularFirestore) {
    this.getCol();
    this.getDocs();
  }

  private getCol() {
    this.col$ = this.afs.collection<Post>('posts');
  }

  private getDocs() {
    this.docs$ = this.col$.valueChanges();
  }
}
