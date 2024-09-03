import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private router: Router) {}

  logout() {
    // Eliminar token del localStorage o cualquier otro almacenamiento
    localStorage.removeItem('token');

    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
