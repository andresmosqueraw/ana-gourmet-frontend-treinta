import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8150/oauth2/authorization/google';

  constructor(private http: HttpClient) {}

  login(): void {
    window.location.href = this.apiUrl;
  }

  // Método para verificar si el usuario está autenticado
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
