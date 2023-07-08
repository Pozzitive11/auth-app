import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, catchError, map, mergeMap, of, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { UserDto } from '@shared/api';
import { AuthService } from '../services';
import { UserService } from '@modules/user/services';
import { AuthActions } from '.';
import { AuthRes } from '../models';
import { environment } from '@environments/environment.development';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((registerData) => this.registerUser(registerData)),
      map(({ accessToken }) => {
        const decodedUser = this.authService.decodeToken(accessToken);
        this.authService.saveAccessToken(accessToken);
        return decodedUser['id'];
      }),
      tap((userId) => {
        return this.userService.getUserById(userId);
      }),
      map(() => {
        this.router.navigate(['/welcome']);
        return AuthActions.authSuccess();
      }),
      catchError((registerError, caught$) => {
        const authError = registerError.error.message;
        this.store.dispatch(AuthActions.authFailure({ authError }));
        return caught$;
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((signInData) => this.loginUser(signInData)),
      map(({ accessToken }) => {
        const decodedUser = this.authService.decodeToken(accessToken);
        this.authService.saveAccessToken(accessToken);
        return decodedUser['id'];
      }),
      tap((userId) => this.userService.getUserById(userId)),
      map(() => {
        this.router.navigate(['/welcome']);
        return AuthActions.authSuccess();
      }),
      catchError((loginError, caught$) => {
        const authError = loginError.error.message;
        this.store.dispatch(AuthActions.authFailure({ authError }));
        return caught$;
      })
    )
  );

  private registerUser(registerData: UserDto): Observable<AuthRes> {
    return this.http.post<AuthRes>(
      `${environment.apiUrl}/auth/registration`,
      registerData
    );
  }

  private loginUser(loginData: UserDto): Observable<AuthRes> {
    return this.http.post<AuthRes>(
      `${environment.apiUrl}/auth/login`,
      loginData
    );
  }
}
