import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertiMoneda',
  standalone: false
})
export class ConvertiMonedaPipe implements PipeTransform {
  transform(valorUSD: number, tasaCambio: number = 950): string {
    if (valorUSD === null || valorUSD === undefined) {
      return '$0';
    }
    const valorCLP = valorUSD * tasaCambio;
    const formatted = valorCLP.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return `$${formatted}`;
  }
}