import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],  // Cambia a styleUrls (en plural)
})

export class LoginComponent {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit - LoginComponent');
    this.route.queryParams.subscribe((params) => {
      console.log('Query Params:', params);
      const token = params['token'];
      if (token) {
        console.log('Token found:', token);
        // Guarda el token en localStorage
        localStorage.setItem('token', token);
  
        // Redirige al usuario a la página principal o a un componente específico
        this.router.navigate(['/home']); // O cualquier otro componente que quieras
      } else {
        console.log('Token not found');
      }
    });
  }
  
  
                    
  

  login() {
    // Llama al método de login en AuthService que redirige al usuario al backend para autenticarse
    this.authService.login();
  }
}
