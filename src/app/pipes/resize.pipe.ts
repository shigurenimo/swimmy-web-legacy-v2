import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resize'
})
export class ResizePipe implements PipeTransform {
  transform (value: any, args?: any): any {
    if (!value) { return ''; }

    if (!value.includes('lh3')) {
      return value;
    }

    switch (args) {
      case 'icon':
        return `${value}=s80-c`;
      case 'post':
        return `${value}=s200-c`;
      default:
        return `${value}=s80-c`;
    }
  }
}
