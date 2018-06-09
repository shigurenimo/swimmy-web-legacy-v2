import { Injectable } from '@angular/core';

import { QueryDocumentSnapshot } from '@firebase/firestore-types';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { UpdateUserInput } from '../interfaces/mutation';
import { User } from '../interfaces/user';
import { FirebaseService, fromQueryDocRef, fromQueryRef } from './firebase.service';

@Injectable()
export class UsersService {

  constructor(private firebaseService: FirebaseService) {
  }

  public getUser(uid) {
    const ref = this.firebaseService.firestore().doc(`users/${uid}`);

    return fromQueryDocRef(ref).pipe(
      map(this.toUserFromQuery),
    );
  }

  public getUserByUsername(username: string) {
    const ref = this.firebaseService.firestore().collection('users');

    const queryFn = (ref) => {
      return ref
        .where('username', '==', username)
        .limit(1);
    };

    const query = queryFn(ref);

    return fromQueryRef(query).pipe(
      map((docs) => docs ? docs[0] : null),
    );
  }

  public updateUser(input: UpdateUserInput) {
    const func = this.firebaseService.functions.httpsCallable('updateUser');

    return from(func(input));
  }

  private toUserFromQuery(queryDocumentSnapshot: QueryDocumentSnapshot): User | null {
    if (!queryDocumentSnapshot.exists) {
      return null;
    }

    return queryDocumentSnapshot.data() as User;
  }
}
