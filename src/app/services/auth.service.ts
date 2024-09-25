import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router'; // Asegúrate de importar el Router

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private googleOAuthUrl = 'http://35.188.66.64:8150/oauth2/authorization/google'; // URL para Google OAuth2
  private loginUrl = 'http://35.188.66.64:8150/auth/login'; // URL para login con correo y contraseña

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router // Inyecta el Router aquí
  ) {}

  // Redirigir al usuario para login con Google
  loginWithGoogle(): void {
    window.location.href = this.googleOAuthUrl;
  }

  // Método para login con correo y contraseña
  loginWithEmail(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password });
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
