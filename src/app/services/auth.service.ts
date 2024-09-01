import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8150/oauth2/authorization/google'; // URL de redirección para iniciar el flujo OAuth2

  constructor(private http: HttpClient) {}

  login(): void {
    window.location.href = this.apiUrl;
  }
}
