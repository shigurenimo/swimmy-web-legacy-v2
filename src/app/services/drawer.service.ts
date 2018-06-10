import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class DrawerService {
  public isOpen$: BehaviorSubject<boolean>;

  constructor() {
    this.isOpen$ = new BehaviorSubject(window.innerWidth > 768);
  }

  public close(): void {
    this.isOpen$.next(false);
  }

  public toggle(): void {
    this.isOpen$.next(!this.isOpen$.getValue());
  }
}
