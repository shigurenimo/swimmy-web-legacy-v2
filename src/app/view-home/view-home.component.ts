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
  col$: AngularFirestoreCollection<Post>;
  docs$: Observable<Post[]>;

  constructor(private afs: AngularFirestore) {
    this.getCol();
    this.getDocs();
  }

  getCol() {
    this.col$ = this.afs.collection<Post>('posts');
  }

  getDocs() {
    this.docs$ = this.col$.valueChanges();
  }
}
