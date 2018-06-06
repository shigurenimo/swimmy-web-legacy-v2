import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {
  public width: number;

  constructor () {
    this.width = window.innerWidth
  }

  public updateWidth (): void {
    this.width = window.innerWidth
  }
}
