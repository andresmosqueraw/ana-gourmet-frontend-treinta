import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'invalid_email') {
        this.errorMessage = 'Error: Correo electrónico no válido para ingreso';
      }
    });
  }

  login() {
    this.authService.login(); // Solo redirige al usuario a la URL de autenticación
  }

  // Método para eliminar las cookies relevantes
  clearCookies() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('token');
  }
}
