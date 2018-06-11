import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class BrowserService {
  public appTitle: BehaviorSubject<string>;
  public leftActionType: BehaviorSubject<string>;

  constructor() {
    this.appTitle = new BehaviorSubject('Swimmy');
    this.leftActionType = new BehaviorSubject('menu');
  }

  public getAppTitle() {
    return this.appTitle;
  }

  public getLeftActionType() {
    return this.leftActionType;
  }

  public updateSnapshot(snapshot: ActivatedRouteSnapshot) {
    this.appTitle.next(snapshot.data.title);
    this.leftActionType.next(snapshot.data.leftActionType || 'menu');
  }
}
