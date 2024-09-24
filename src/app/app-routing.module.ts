import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { LoginComponent } from './components/login/login.component'; // Importa el LoginComponent
import { AuthGuard } from './services/Authguard.service'; // Importa el AuthGuard

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige la ruta raíz al login
  { path: 'login', component: LoginComponent }, // Ruta para el componente de login
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protege el dashboard con AuthGuard
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'inventarios', component: InventariosComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'clientes', component: ClientesComponent },
    ],
  },
  { path: '**', redirectTo: '/login' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
