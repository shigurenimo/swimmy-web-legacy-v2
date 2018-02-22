import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFireAuth } from 'angularfire2/auth';

import { environment } from '../../environments/environment';

@Injectable()
export class FunctionsService {
  constructor(
    private afa: AngularFireAuth,
    private http: HttpClient) {
  }

  public restoreUser(payload) {
    const url = `${environment.function}/restoreUser`;

    return this.http.post<any>(url, payload);
  }
}
