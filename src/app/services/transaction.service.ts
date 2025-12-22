import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private CURRENT_USER_KEY = 'currentUser';

  constructor(private databaseService: DatabaseService) {}

  async guardarTransaccion(transaction: Transaction): Promise<void> {
    transaction.fecha = new Date().toISOString();
    const currentUser = this.obtenerUsuarioActual();
    transaction.usuario_email = currentUser;
    
    await this.databaseService.guardarTransaccion(transaction);
  }

  async obtenerTransacciones(): Promise<Transaction[]> {
    const currentUser = this.obtenerUsuarioActual();
    return await this.databaseService.obtenerTransacciones(currentUser);
  }

  async eliminarTransaccion(id: number): Promise<void> {
    await this.databaseService.eliminarTransaccion(id);
  }

  async calcularBalance(): Promise<{ ingresos: number, gastos: number, total: number }> {
    const transacciones = await this.obtenerTransacciones();
    const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
    const gastos = transacciones.filter(t => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0);
    return { ingresos, gastos, total: ingresos - gastos };
  }

  async obtenerGastosPorCategoria(): Promise<{ [categoria: string]: number }> {
    const transacciones = await this.obtenerTransacciones();
    const gastos = transacciones.filter(t => t.tipo === 'gasto');
    const resultado: { [categoria: string]: number } = {};
    gastos.forEach(gasto => {
      if (resultado[gasto.categoria]) {
        resultado[gasto.categoria] += gasto.monto;
      } else {
        resultado[gasto.categoria] = gasto.monto;
      }
    });
    return resultado;
  }

  private obtenerUsuarioActual(): string {
    return localStorage.getItem(this.CURRENT_USER_KEY) || '';
  }

  // Método de migración inicial (solo por compatibilidad)
  private inicializarDatosEjemplo(): void {
    // Ya no se usa, SQLite maneja los datos
  }
}