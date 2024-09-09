import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private googleOAuthUrl = 'http://localhost:8150/oauth2/authorization/google'; // URL para Google OAuth2
  private loginUrl = 'http://localhost:8150/login'; // URL para login con correo y contraseña

  constructor(private http: HttpClient) {}

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
    return !!token;
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
