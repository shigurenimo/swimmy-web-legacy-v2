import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resize'
})
export class ResizePipe implements PipeTransform {
  transform (value: any, args?: any): any {
    if (!value) { return ''; }

    console.log('value', value);

    if (!value.includes('lh3')) {
      return value;
    }

    switch (args) {
      case 'replica':
        return `${value}=s10`;
      case 'icon':
        return `${value}=s80-c`;
      case 'image':
        return `${value}=s600`;
      case 'post':
        return `${value}=s200-c`;
      default:
        return `${value}=s80-c`;
    }
  }
}
