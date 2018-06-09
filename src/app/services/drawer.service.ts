import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DrawerService {
  public isOpen$: Subject<boolean> = new Subject();

  private isOpen: boolean = window.innerWidth < 768;

  constructor() {
    this.isOpen$.next(this.isOpen);
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
    this.isOpen$.next(this.isOpen);
  }
}
