import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    // Verifica si el token existe y no ha expirado
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true; // Permite el acceso a la ruta
    } else {
      // Redirige al login si el token no es válido o no existe
      this.router.navigate(['/login']);
      return false;
    }
  }
}
