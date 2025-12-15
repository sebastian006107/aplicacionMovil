import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearFecha',
  standalone: false
})
export class FormatearFechaPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const fecha = new Date(value);
    if (isNaN(fecha.getTime())) return '';
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
}