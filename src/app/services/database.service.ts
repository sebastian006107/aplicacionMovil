import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private isInitialized = false;

  constructor() {}

  async initializeDatabase(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Solo funciona en plataformas nativas
      if (Capacitor.getPlatform() === 'web') {
        console.log('SQLite no disponible en web, usando localStorage');
        return;
      }

      // Crear conexión
      this.db = await this.sqlite.createConnection(
        'billetera_db',
        false,
        'no-encryption',
        1,
        false
      );

      await this.db.open();

      // Crear tabla de transacciones
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo TEXT NOT NULL,
          monto REAL NOT NULL,
          categoria TEXT NOT NULL,
          descripcion TEXT,
          fecha TEXT NOT NULL,
          usuario_email TEXT NOT NULL,
          foto_comprobante TEXT
        );
      `);

      // Crear tabla de usuarios
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );
      `);

      this.isInitialized = true;
      console.log('Base de datos SQLite inicializada');
      
      // Migrar datos de localStorage a SQLite
      await this.migrateFromLocalStorage();

    } catch (error) {
      console.error('Error inicializando SQLite:', error);
    }
  }

  private async migrateFromLocalStorage(): Promise<void> {
    if (!this.db) return;

    try {
      // Migrar usuarios
      const usuarios = localStorage.getItem('usuarios');
      if (usuarios) {
        const usuariosArray = JSON.parse(usuarios);
        for (const usuario of usuariosArray) {
          await this.db.run(
            'INSERT OR IGNORE INTO usuarios (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
            [usuario.nombre, usuario.apellido, usuario.email, usuario.password]
          );
        }
        console.log('Usuarios migrados a SQLite');
      }

      // Migrar transacciones
      const transactions = localStorage.getItem('transactions');
      if (transactions) {
        const transactionsArray = JSON.parse(transactions);
        for (const t of transactionsArray) {
          await this.db.run(
            'INSERT OR IGNORE INTO transactions (tipo, monto, categoria, descripcion, fecha, usuario_email, foto_comprobante) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [t.tipo, t.monto, t.categoria, t.descripcion, t.fecha, t.usuario_email, t.foto_comprobante || '']
          );
        }
        console.log('Transacciones migradas a SQLite');
      }
    } catch (error) {
      console.error('Error en migración:', error);
    }
  }

  async guardarTransaccion(transaction: any): Promise<void> {
    if (!this.db) {
      // Fallback a localStorage
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transaction.id = transactions.length + 1;
      transactions.push(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      return;
    }

    await this.db.run(
      'INSERT INTO transactions (tipo, monto, categoria, descripcion, fecha, usuario_email, foto_comprobante) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [transaction.tipo, transaction.monto, transaction.categoria, transaction.descripcion, transaction.fecha, transaction.usuario_email, transaction.foto_comprobante || '']
    );
  }

  async obtenerTransacciones(usuarioEmail: string): Promise<any[]> {
    if (!this.db) {
      // Fallback a localStorage
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      return transactions.filter((t: any) => t.usuario_email === usuarioEmail);
    }

    const result = await this.db.query(
      'SELECT * FROM transactions WHERE usuario_email = ? ORDER BY fecha DESC',
      [usuarioEmail]
    );

    return result.values || [];
  }

  async eliminarTransaccion(id: number): Promise<void> {
    if (!this.db) {
      // Fallback a localStorage
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const filtered = transactions.filter((t: any) => t.id !== id);
      localStorage.setItem('transactions', JSON.stringify(filtered));
      return;
    }

    await this.db.run('DELETE FROM transactions WHERE id = ?', [id]);
  }

  async guardarUsuario(usuario: any): Promise<void> {
    if (!this.db) {
      // Fallback a localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      usuarios.push(usuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      return;
    }

    await this.db.run(
      'INSERT INTO usuarios (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
      [usuario.nombre, usuario.apellido, usuario.email, usuario.password]
    );
  }

  async validarLogin(email: string, password: string): Promise<boolean> {
    if (!this.db) {
      // Fallback a localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      return usuarios.some((u: any) => u.email === email && u.password === password);
    }

    const result = await this.db.query(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email, password]
    );

    return (result.values?.length || 0) > 0;
  }
}