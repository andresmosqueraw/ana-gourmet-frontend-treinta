// o-auth2-callback.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth2-callback',
  template: '',
})
export class OAuth2CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('token', token);
        this.router.navigate(['/home']);
      } else {
        // Manejar el caso en que no hay token
        this.router.navigate(['/login'], {
          queryParams: { error: 'invalid_token' },
        });
      }
    });
  }
}
