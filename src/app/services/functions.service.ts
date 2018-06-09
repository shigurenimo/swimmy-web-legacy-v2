import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable()
export class FunctionsService {
  constructor(
    private http: HttpClient) {
  }

  public restoreUser(payload) {
    const url = `${environment.function}/restoreUser`;

    return this.http.post<any>(url, payload);
  }
}
