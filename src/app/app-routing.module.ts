import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { LoginComponent } from './components/login/login.component'; // Importa el componente de login
import { AuthGuard } from './services/authguard.services'; // Importa el guard para proteger las rutas

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige la ruta raíz al login
  { path: 'login', component: LoginComponent }, // Ruta para el login
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard], // Protege la ruta home con AuthGuard
  },
  {
    path: 'dashboard',
    component: HomeComponent, // Añadir un componente base para el dashboard
    canActivate: [AuthGuard], // Protege las rutas del dashboard con AuthGuard
    children: [
      { path: 'ventas', component: VentasComponent },
      { path: 'inventarios', component: InventariosComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'clientes', component: ClientesComponent },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Redirige cualquier ruta no encontrada al login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
