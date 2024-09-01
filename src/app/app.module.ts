import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt'; // Importa JwtHelperService y JWT_OPTIONS

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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule // Importar ReactiveFormsModule para manejar formularios reactivos
  ],
  providers: [
    provideHttpClient(), // Configuración del HttpClient
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, // Proporciona las opciones por defecto de JWT_OPTIONS
    JwtHelperService // Proveedor para JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
