import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'; // Agregar las importaciones necesarias
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})


export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private jwtHelper: JwtHelperService ) {}

// auth.guard.ts

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const token = localStorage.getItem('token');

  if (token && !this.jwtHelper.isTokenExpired(token)) {
    return true;
  } else {
    this.router.navigate(['/login'], {
      queryParams: {
        error: 'expired_or_invalid_token',
        returnUrl: state.url,
      },
    });
    return false;
  }
}

  
}
