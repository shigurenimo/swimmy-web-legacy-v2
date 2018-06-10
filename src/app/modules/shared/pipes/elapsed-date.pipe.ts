import { Pipe, PipeTransform } from '@angular/core';

import { Timestamp } from '@firebase/firestore-types';

@Pipe({
  name: 'elapsedDate',
})
export class ElapsedDatePipe implements PipeTransform {
  transform(value: Timestamp, args?: any): String {
    const diff = new Date().getTime() - value.toDate().getTime();
    const hours = Math.round(diff / (1000 * 60 * 60));
    if (hours < 1) {
      return Math.round(diff / (1000 * 60)) + '分前';
    }
    if (hours < 24) {
      return hours + '時間前';
    }
    return Math.round(diff / (1000 * 60 * 60 * 24)) + '日前';
  }
}
