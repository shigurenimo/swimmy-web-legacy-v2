import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot } from '@angular/router';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class BrowserService {
  public appTitle: BehaviorSubject<string>;
  public leftActionType: BehaviorSubject<string>;

  constructor(
    private htmlTitle: Title,
    private htmlMeta: Meta,
  ) {
    this.appTitle = new BehaviorSubject('Swimmy');
    this.leftActionType = new BehaviorSubject('menu');
  }

  public getAppTitle() {
    return this.appTitle;
  }

  public getLeftActionType() {
    return this.leftActionType;
  }

  public updateAppUIFromSnapshot(snapshot: ActivatedRouteSnapshot) {
    this.appTitle.next(snapshot.data.title);
    this.leftActionType.next(snapshot.data.leftActionType || 'menu');
  }

  public updateHtmlTitle(title: string) {
    this.htmlTitle.setTitle(title);
  }

  public updateHtmlDescription(description: string) {
    this.htmlMeta.updateTag({name: 'description', content: description});
  }

  public updateHtml(title: string, description = '') {
    this.updateHtmlTitle(title);
    this.updateHtmlDescription(description);
  }

  public updateHtmlFromSnapshot(snapshot: ActivatedRouteSnapshot) {
    this.htmlTitle.setTitle(snapshot.data.title);
  }
}
