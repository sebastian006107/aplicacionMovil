import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private databaseService: DatabaseService) {}

  async guardarUsuario(usuario: any): Promise<void> {
    await this.databaseService.guardarUsuario(usuario);
  }

  async validarLogin(email: string, password: string): Promise<boolean> {
    return await this.databaseService.validarLogin(email, password);
  }

  obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }
}