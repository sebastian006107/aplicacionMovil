import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  // Guardar usuario
  guardarUsuario(usuario: any) {
    const usuarios = this.obtenerUsuarios();
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  // Obtener todos los usuarios
  obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  // Validar login
  validarLogin(email: string, password: string): boolean {
    const usuarios = this.obtenerUsuarios();
    return usuarios.some(u => u.email === email && u.password === password);
  }

}