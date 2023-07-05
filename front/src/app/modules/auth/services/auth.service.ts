import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  pairwise,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { User } from '@modules/user/models';
import { UserActions } from '@modules/user/store';
import { AuthActions, selectAuthError } from '../store';
import { Auth, AuthRes } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _accessToken$ = new BehaviorSubject<string>(null);

  constructor(
    private store: Store,
    private http: HttpClient,
    private router: Router
  ) {
    const token = this.getAccessToken();
    const user = this.decodeToken(token);
    if (token) {
      this.store.dispatch(UserActions.loadUserSuccess(user));
    }
    this.initSubs();
  }

  login(email: string, password: string): void {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  register(email: string, password: string): void {
    this.store.dispatch(AuthActions.register({ email, password }));
  }

  getAuthError(): Observable<string> {
    return this.store.pipe(select(selectAuthError));
  }

  clearAuthError(): void {
    return this.store.dispatch(AuthActions.clearAuthError());
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${environment.apiUrl}/auth/logout`).pipe(
      tap(() => {
        this.removeToken();
        this.store.dispatch(UserActions.clearUser());
        this.router.navigate(['/home']);
      })
    );
  }

  decodeToken(token: string): User {
    if (!token) {
      return null;
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  refreshToken(): Observable<AuthRes> {
    return this.http.get<AuthRes>(`${environment.apiUrl}/auth/refresh`).pipe(
      tap(({ accessToken }) => {
        this.setCredentials(accessToken);
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }
  private initSubs(): void {
    this._accessToken$
      .pipe(
        pairwise(),
        tap(([prev, curr]) => {
          if (!prev && curr) {
            this.router.navigate(['/welcome']);
          } else if (prev && !curr) {
            this.router.navigate(['/login']);
          }
        })
      )
      .subscribe();
  }

  private setCredentials(token: string): void {
    this.saveAccessToken(token);
    this._accessToken$.next(token);
  }

  saveAccessToken(token: string) {
    localStorage.setItem(Auth.accessToken, token);
  }

  getAccessToken(): string {
    return localStorage.getItem(Auth.accessToken);
  }

  removeToken(): void {
    localStorage.removeItem(Auth.accessToken);
    this._accessToken$.next(null);
  }
}
