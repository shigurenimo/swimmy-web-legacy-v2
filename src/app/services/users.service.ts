import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { queryUser } from '../queries/users';

@Injectable()
export class UsersService {

  constructor(private apollo: Apollo) {
  }

  public getUser(id?, username?) {
    return this.apollo.watchQuery<any>({
      query: queryUser,
      variables: {id, username}
    }).valueChanges;
  }

  public updateUser(id, input) {
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
      variables: {id, input}
    });
  }
}
