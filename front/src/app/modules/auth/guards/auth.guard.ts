import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Observable<boolean> | Promise<boolean> {
    const authenticated = this.authService.isAuthenticated();

    if (authenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
