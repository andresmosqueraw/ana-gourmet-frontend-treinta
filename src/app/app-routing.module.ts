import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/Authguard.service';
import { OAuth2CallbackComponent } from './components/o-auth2-callback/o-auth2-callback.component'; // Importa el nuevo componente
import { LocationStrategy, HashLocationStrategy } from '@angular/common'; // Importa esto
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'oauth2/callback', component: OAuth2CallbackComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'inventarios', component: InventariosComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'clientes', component: ClientesComponent },
    ],
  },
  // Ruta comodín para manejar rutas no encontradas
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy } // Añade esto
  ]
})
export class AppRoutingModule {}
