import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface IndicadorDolar {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  fecha: string;
  valor: number;
}

export interface RespuestaMindicador {
  version: string;
  autor: string;
  fecha: string;
  dolar: IndicadorDolar;
  uf: IndicadorDolar;
  utm: IndicadorDolar;
}

@Injectable({
  providedIn: 'root'
})
export class DolarService {
  
  private readonly API_URL = 'https://mindicador.cl/api';
  private readonly STORAGE_KEY = 'valorDolar';
  private readonly CACHE_TIME = 3600000; // 1 hora en milisegundos

  constructor(private http: HttpClient) { }

  // CONSULTA SÍNCRONA (Promise con async/await)
  async obtenerDolarSync(): Promise<number> {
    try {
      const response = await this.http.get<RespuestaMindicador>(this.API_URL).toPromise();
      const valorDolar = response?.dolar?.valor || 0;
      
      // Guardar en localStorage con timestamp
      this.guardarEnCache(valorDolar);
      
      return valorDolar;
    } catch (error) {
      console.error('Error obteniendo dólar (sync):', error);
      // Si falla, devolver valor en caché
      return this.obtenerDeCache();
    }
  }

  // CONSULTA ASÍNCRONA (Observable)
  obtenerDolarAsync(): Observable<number> {
    return this.http.get<RespuestaMindicador>(this.API_URL).pipe(
      map(response => {
        const valorDolar = response?.dolar?.valor || 0;
        this.guardarEnCache(valorDolar);
        return valorDolar;
      }),
      catchError(error => {
        console.error('Error obteniendo dólar (async):', error);
        return of(this.obtenerDeCache());
      })
    );
  }

  // OBTENER INDICADORES COMPLETOS
  async obtenerIndicadoresCompletos(): Promise<RespuestaMindicador | null> {
    try {
      const response = await this.http.get<RespuestaMindicador>(this.API_URL).toPromise();
      return response || null;
    } catch (error) {
      console.error('Error obteniendo indicadores:', error);
      return null;
    }
  }

  // HISTORIAL DEL DÓLAR (últimos 30 días)
  obtenerHistorialDolar(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/dolar`).pipe(
      map(response => response?.serie || []),
      catchError(error => {
        console.error('Error obteniendo historial:', error);
        return of([]);
      })
    );
  }

  // GESTIÓN DE CACHÉ
  private guardarEnCache(valor: number): void {
    const data = {
      valor: valor,
      timestamp: Date.now()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private obtenerDeCache(): number {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Verificar si el caché es válido (menos de 1 hora)
      if (Date.now() - parsed.timestamp < this.CACHE_TIME) {
        return parsed.valor;
      }
    }
    return 0;
  }

  public limpiarCache(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // CONVERTIR PESOS A DÓLARES
  async convertirPesosADolares(montoPesos: number): Promise<number> {
    const valorDolar = await this.obtenerDolarSync();
    if (valorDolar === 0) return 0;
    return montoPesos / valorDolar;
  }

  // CONVERTIR DÓLARES A PESOS
  async convertirDolaresAPesos(montoDolares: number): Promise<number> {
    const valorDolar = await this.obtenerDolarSync();
    return montoDolares * valorDolar;
  }
}