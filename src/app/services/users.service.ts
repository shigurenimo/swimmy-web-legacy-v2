import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';

import { queryUser } from '../queries/users';

@Injectable()
export class UsersService {

  constructor(private apollo: Apollo) { }

  public getDoc(variables) {
    return this.apollo
      .watchQuery<any>({query: queryUser, variables})
      .valueChanges;
  }
}
