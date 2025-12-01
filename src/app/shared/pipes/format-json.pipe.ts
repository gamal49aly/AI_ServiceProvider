import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatJson'
})
export class FormatJsonPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
