import { Injectable, NgZone } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class ZoneService {
  constructor(private ngZone: NgZone) {
  }

  runOutsideAngular<T>(observable: Observable<T>): Observable<T> {
    return new Observable<T>(subscriber => {
      const next = (value) => {
        this.ngZone.run(() => {
          subscriber.next(value);
        });
      };
      const error = (err) => {
        this.ngZone.run(() => {
          subscriber.error(err);
        });
      };
      const complete = () => {
        this.ngZone.run(() => {
          subscriber.complete();
        });
      };
      return observable.subscribe(next, error, complete);
    });
  }
}
