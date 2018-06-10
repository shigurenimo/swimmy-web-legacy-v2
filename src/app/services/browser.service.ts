import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Subject } from 'rxjs';

@Injectable()
export class BrowserService {
  public appTitle: Subject<string> = new Subject();

  constructor() {
  }

  public getAppTitle() {
    return this.appTitle;
  }

  public updateSnapshot(snapshot: ActivatedRouteSnapshot) {
    this.appTitle.next(snapshot.data.title);
  }
}
