import { Injectable } from '@angular/core';

import { QueryDocumentSnapshot } from '@firebase/firestore-types';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { UpdateUserInput } from '../interfaces/mutation';
import { User } from '../interfaces/user';
import { FirebaseService, fromQueryDocRef, fromQueryRef } from './firebase.service';

@Injectable()
export class UsersService {

  constructor(
    private apollo: Apollo,
    private firebaseService: FirebaseService,
  ) {
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

  public updateUser(input: UpdateUserInput & {id: string}) {
    const func = this.firebaseService.functions.httpsCallable('updateUser');

    return from(func(input));
  }

  public _updateUser(id: string, input: UpdateUserInput) {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation updateUser($id: ID!, $input: UpdateUserInput!) {
          updateUser(id: $id, input: $input) {
            description
            displayName
            photoURL
            postCount
            updatedAt
            uid
          }
        }
      `,
      variables: {id, input},
    });
  }

  private toUserFromQuery(queryDocumentSnapshot: QueryDocumentSnapshot): User | null {
    if (!queryDocumentSnapshot.exists) {
      return null;
    }

    return queryDocumentSnapshot.data() as User;
  }
}
