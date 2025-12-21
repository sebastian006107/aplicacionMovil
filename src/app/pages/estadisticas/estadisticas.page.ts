import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { CATEGORIAS } from '../../models/transaction.model';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
  standalone: false
})
export class EstadisticasPage implements OnInit {

  balance = { ingresos: 0, gastos: 0, total: 0 };
  topCategorias: { categoria: string, monto: number }[] = [];

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.balance = this.transactionService.calcularBalance();
    const gastosPorCat = this.transactionService.obtenerGastosPorCategoria();
    
    this.topCategorias = Object.keys(gastosPorCat)
      .map(cat => ({ categoria: cat, monto: gastosPorCat[cat] }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5);
  }

  formatearMoneda(monto: number): string {
    return `$${monto.toLocaleString('es-CL')}`;
  }

  obtenerIcono(categoria: string): string {
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.icono || 'ellipsis-horizontal';
  }

  obtenerColor(categoria: string): string {
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.color || '#B2BEC3';
  }

}
