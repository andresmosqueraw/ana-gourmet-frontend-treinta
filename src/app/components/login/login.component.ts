import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const error = params['error'];

      if (error === 'invalid_email') {
        this.errorMessage = 'Error: Correo electrónico no válido para ingreso';
      } else if (token) {
        this.handleToken(token);
      }
    });
  }

  login() {
    this.clearCookies();
    this.authService.login();
  }

  // Método para manejar el token
  handleToken(token: string) {
    // Aquí puedes guardar el token en localStorage o en algún servicio para manejar el estado del usuario
    localStorage.setItem('token', token);
    this.router.navigate(['/home']); // Redirige al usuario al home después de iniciar sesión
  }

  // Método para eliminar las cookies relevantes
  clearCookies() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('token');
  }
}
