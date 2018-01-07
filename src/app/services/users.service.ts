import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { User } from '../models/User';

@Injectable()
export class UsersService {

  constructor(private afs: AngularFirestore) { }

  public fetch(id: string) {
    return this.afs
      .collection<User>('users')
      .doc(id)
      .snapshotChanges()
      .map(snapshot => {
        const payload = snapshot.payload;
        if (!payload.exists) {
          return;
        }
        return {
          id: payload.id,
          ...payload.data() as User
        };
      })
      .share();
  }
}
