import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  toBool(value: string) {
    return value === '' || value;
  }
}
