import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearMoneda',
  standalone: false
})
export class FormatearMonedaPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined) {
      return '$0';
    }
    const formatted = value.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return `$${formatted}`;
  }
}