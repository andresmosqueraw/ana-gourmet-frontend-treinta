import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importar 'withInterceptors' si usas interceptores
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

// Función para obtener el token desde localStorage
export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    VentasComponent,
    InventariosComponent,
    ProveedoresComponent,
    ClientesComponent,
    HomeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
  ],
  providers: [
    provideHttpClient(
      withInterceptors([
        // Aquí puedes agregar interceptores si los necesitas
      ])
    ),
    { 
      provide: JWT_OPTIONS, 
      useValue: { 
        tokenGetter: tokenGetter, 
        allowedDomains: ['localhost:4200'], // Ajusta según tu dominio si es necesario
        disallowedRoutes: ['localhost:4200/api/auth'], // Rutas donde no quieres enviar el token
      } 
    },
    JwtHelperService, // Proveedor para JwtHelperService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
