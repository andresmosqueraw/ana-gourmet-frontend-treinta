import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
        console.log('Error: Correo electrónico no válido'); // Log de error
        this.errorMessage = 'Error: Correo electrónico no válido para ingreso';
      } else if (token) {
        console.log('Token recibido:', token); // Log del token recibido
        this.handleToken(token);
      }
    });
  }
  
  handleToken(token: string): void {
    console.log('Almacenando token en localStorage y redirigiendo a dashboard/inventarios'); // Log antes de redirigir
    localStorage.setItem('token', token);
    this.router.navigate(['/dashboard/inventarios']);
  }
  
  login() {
    this.authService.login(); // Redirige al usuario a la URL de autenticación
  }

  // Método para eliminar las cookies relevantes
  clearCookies() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('token');
  }
}
