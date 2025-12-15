import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificar si existe un usuario en sesión
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser && currentUser !== '') {
      // Usuario autenticado, permitir acceso
      return true;
    } else {
      // Usuario no autenticado, redirigir a login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
