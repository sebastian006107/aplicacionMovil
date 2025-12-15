export interface Transaction {
  id?: number;
  tipo: 'ingreso' | 'gasto';
  monto: number;
  categoria: string;
  descripcion: string;
  fecha: string;
  usuario_email: string;
  foto_comprobante?: string;
  latitud?: number;
  longitud?: number;
  direccion?: string;
}

export interface Categoria {
  nombre: string;
  icono: string;
  color: string;
}

export const CATEGORIAS: Categoria[] = [
  { nombre: 'Alimentación', icono: 'restaurant', color: '#FF6B6B' },
  { nombre: 'Transporte', icono: 'car', color: '#4ECDC4' },
  { nombre: 'Vivienda', icono: 'home', color: '#45B7D1' },
  { nombre: 'Salud', icono: 'medical', color: '#96CEB4' },
  { nombre: 'Entretenimiento', icono: 'game-controller', color: '#FFEAA7' },
  { nombre: 'Compras', icono: 'cart', color: '#A29BFE' },
  { nombre: 'Educación', icono: 'school', color: '#FD79A8' },
  { nombre: 'Servicios', icono: 'construct', color: '#74B9FF' },
  { nombre: 'Salario', icono: 'cash', color: '#55EFC4' },
  { nombre: 'Otros', icono: 'ellipsis-horizontal', color: '#B2BEC3' }
];