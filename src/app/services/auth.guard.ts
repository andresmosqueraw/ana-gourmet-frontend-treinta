import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
  
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      console.log('Token is valid');
      return true;
    } else {
      console.log('Token is invalid or expired');
      this.router.navigate(['/']);
      return false;
    }
  }
  
}
