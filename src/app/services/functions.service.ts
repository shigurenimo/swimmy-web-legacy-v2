import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import axios from 'axios';

import { environment } from '../../environments/environment';

@Injectable()
export class FunctionsService {
  constructor(private afa: AngularFireAuth) {
  }

  public addPost(payload) {
    return this.callFunctionWithToken('addPost', payload);
  }

  public updatePostTags(payload) {
    return this.callFunctionWithToken('updatePostTags', payload);
  }

  private callFunction(name: string, payload = {}) {
    return axios({
      method: 'POST',
      url: `${environment.function}/${name}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    });
  }

  private callFunctionWithToken(name: string, payload = {}) {
    return this.afa.auth.currentUser.getIdToken()
      .then(idToken => {
        return axios({
          method: 'POST',
          url: `${environment.function}/${name}`,
          headers: {
            'authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          },
          data: payload
        });
      });
  }
}
