import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';  // Asegúrate de importar esto
import { Router } from '@angular/router';  // Asegúrate de importar esto

@Injectable()  // Esto es importante
export class AuthInterceptor implements HttpInterceptor {
    constructor(private jwtHelper: JwtHelperService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
    
        if (token) {
          // Verificar si el token ha expirado
          if (this.jwtHelper.isTokenExpired(token)) {
            // Si el token ha expirado, redirigir al login
            localStorage.removeItem('token');
            this.router.navigate(['/login'], {
              queryParams: { error: 'expired_or_invalid_token' },
            });
            return next.handle(request);
          }
    
          // Clonar la solicitud y añadir el encabezado Authorization
          const clonedRequest = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`),
          });
    
          return next.handle(clonedRequest);
        } else {
          return next.handle(request);
        }
      }
}
