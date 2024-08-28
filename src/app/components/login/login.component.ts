import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verifica si hay un token en los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        // Guarda el token en localStorage
        localStorage.setItem('token', token);

        // Redirige al usuario a la página principal o a un componente específico
        this.router.navigate(['/cliente']); // O cualquier otro componente que quieras
      }
    });
  }

  login() {
    // Llama al método de login en AuthService que redirige al usuario al backend para autenticarse
    this.authService.login();
  }
}
