import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup; // Formulario para correo/contraseña
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Formulario reactivo para correo y contraseña
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Verificar parámetros de la URL
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

  // Guardar token y redirigir
  handleToken(token: string): void {
    localStorage.setItem('token', token);
    this.router.navigate(['/dashboard/inventarios']);
  }

  // Iniciar sesión con Google
  loginWithGoogle(): void {
    this.authService.loginWithGoogle(); // Redirige para el login con Google
  }

  // Iniciar sesión con correo/contraseña
  loginWithEmail(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.loginWithEmail(email, password).subscribe({
        next: (response: any) => {
          const token = response.token;
          this.handleToken(token);
        },
        error: (error) => {
          this.errorMessage = 'Error: correo o contraseña incorrectos';
        },
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un correo y contraseña válidos';
    }
  }

  // Método para eliminar las cookies
  clearCookies(): void {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('token');
  }
}
