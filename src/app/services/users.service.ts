import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { UpdateUserInput } from '../interfaces/mutation';
import { User } from '../interfaces/user';

@Injectable()
export class UsersService {

  constructor (
    private apollo: Apollo,
    private afs: AngularFirestore) {
  }

  public getUser (uid) {
    return this.afs.doc(`users/${uid}`).valueChanges()
  }

  public getUserByUsername (username) {
    const query = (ref) => {
      return ref
        .where('username', '==', username)
        .limit(1);
    };
    return this.afs.collection<User>('users', query)
      .valueChanges()
      .map((docs) => {
        return docs ? docs[0] : null;
      });
  }

  public updateUser (id: string, input: UpdateUserInput) {
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
      variables: { id, input }
    });
  }
}
