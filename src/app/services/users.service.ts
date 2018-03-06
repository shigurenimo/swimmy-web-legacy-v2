import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';

import { queryUser, updateUser } from '../queries/users';

@Injectable()
export class UsersService {

  constructor (private apollo: Apollo) { }

  public getUser (id?, username?) {
    return this.apollo.watchQuery<any>({
      query: queryUser,
      variables: { id, username }
    }).valueChanges
  }

  public updateUser (id, input) {
    return this.apollo.mutate<any>({
      mutation: updateUser,
      variables: { id, input }
    });
  }
}
