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
  if (this.authService.isAuthenticated()) {
    this.router.navigate(['/home']);
  }

  this.route.queryParams.subscribe((params) => {
    const error = params['error'];

    if (error === 'invalid_email') {
      this.errorMessage = 'Error: Correo electrónico no válido para ingreso';
    } else if (error === 'expired_or_invalid_token') {
      this.errorMessage = 'Tu sesión ha expirado o el correo electrónico no es válido. Por favor, inicia sesión nuevamente.';
    } else if (error === 'invalid_token') {
      this.errorMessage = 'Error al procesar el token de autenticación. Por favor, intenta iniciar sesión nuevamente.';
    }
  });
}


handleToken(token: string): void {
  localStorage.setItem('token', token);

  // Redirigir al usuario a la ruta que intentaba acceder antes de iniciar sesión
  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  this.router.navigate([returnUrl]);
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
          // Maneja el error según la respuesta del backend
          if (error.status === 401) {
            this.errorMessage = 'Error: correo o contraseña incorrectos';
          } else {
            this.errorMessage = 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.';
          }
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
 

handleLoginSuccess(): void {
  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  this.router.navigate([returnUrl]);
}

}
