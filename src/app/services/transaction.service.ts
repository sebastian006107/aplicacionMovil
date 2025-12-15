import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private STORAGE_KEY = 'transactions';
  private CURRENT_USER_KEY = 'currentUser';

  constructor() {
    if (this.obtenerTransacciones().length === 0) {
      this.inicializarDatosEjemplo();
    }
  }

  guardarTransaccion(transaction: Transaction): void {
    const transacciones = this.obtenerTransacciones();
    transaction.id = this.generarId();
    transaction.fecha = new Date().toISOString();
    const currentUser = this.obtenerUsuarioActual();
    transaction.usuario_email = currentUser;
    transacciones.push(transaction);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transacciones));
  }

  obtenerTransacciones(): Transaction[] {
    const transacciones = localStorage.getItem(this.STORAGE_KEY);
    const allTransactions = transacciones ? JSON.parse(transacciones) : [];
    const currentUser = this.obtenerUsuarioActual();
    return allTransactions.filter((t: Transaction) => t.usuario_email === currentUser);
  }

  obtenerTransaccionPorId(id: number): Transaction | undefined {
    const transacciones = this.obtenerTransacciones();
    return transacciones.find(t => t.id === id);
  }

  actualizarTransaccion(transaction: Transaction): void {
    const transacciones = localStorage.getItem(this.STORAGE_KEY);
    let allTransactions = transacciones ? JSON.parse(transacciones) : [];
    const index = allTransactions.findIndex((t: Transaction) => t.id === transaction.id);
    if (index !== -1) {
      allTransactions[index] = transaction;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allTransactions));
    }
  }

  eliminarTransaccion(id: number): void {
    const transacciones = localStorage.getItem(this.STORAGE_KEY);
    let allTransactions = transacciones ? JSON.parse(transacciones) : [];
    allTransactions = allTransactions.filter((t: Transaction) => t.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allTransactions));
  }

  calcularBalance(): { ingresos: number, gastos: number, total: number } {
    const transacciones = this.obtenerTransacciones();
    const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
    const gastos = transacciones.filter(t => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0);
    return { ingresos, gastos, total: ingresos - gastos };
  }

  obtenerGastosPorCategoria(): { [categoria: string]: number } {
    const transacciones = this.obtenerTransacciones();
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

  private generarId(): number {
    const transacciones = localStorage.getItem(this.STORAGE_KEY);
    const allTransactions = transacciones ? JSON.parse(transacciones) : [];
    if (allTransactions.length === 0) return 1;
    const maxId = Math.max(...allTransactions.map((t: Transaction) => t.id || 0));
    return maxId + 1;
  }

  private inicializarDatosEjemplo(): void {
    const ejemplos: Transaction[] = [
      {
        id: 1,
        tipo: 'ingreso',
        monto: 500000,
        categoria: 'Salario',
        descripcion: 'Sueldo mensual',
        fecha: new Date(2024, 11, 1).toISOString(),
        usuario_email: 'demo@demo.com'
      },
      {
        id: 2,
        tipo: 'gasto',
        monto: 15000,
        categoria: 'Alimentación',
        descripcion: 'Supermercado',
        fecha: new Date(2024, 11, 5).toISOString(),
        usuario_email: 'demo@demo.com'
      },
      {
        id: 3,
        tipo: 'gasto',
        monto: 8000,
        categoria: 'Transporte',
        descripcion: 'Bencina',
        fecha: new Date(2024, 11, 10).toISOString(),
        usuario_email: 'demo@demo.com'
      }
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ejemplos));
  }
}