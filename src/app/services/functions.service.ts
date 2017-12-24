import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import axios from 'axios';

import { environment } from '../../environments/environment';

@Injectable()
export class FunctionsService {
  constructor(private afa: AngularFireAuth) {
  }

  public createPost(payload) {
    return this.getIdToken()
      .then(idToken => {
        axios({
          method: 'POST',
          url: `${environment.function}/addPost`,
          headers: {
            'authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          },
          data: payload
        });
      });
  }

  private getIdToken() {
    return this.afa.auth.currentUser.getIdToken();
  }
}
