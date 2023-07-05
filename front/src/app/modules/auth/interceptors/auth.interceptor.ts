import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = this.addAuthHeader(req);

    return next.handle(req).pipe(
      catchError((error) => {
        return this.handleResError(error, req, next);
      })
    );
  }

  private handleResError(
    error: any,
    prevReq?: HttpRequest<any>,
    next?: HttpHandler
  ): Observable<any> {
    if (
      error.message !== 'Session token expired' ||
      error.url.includes(`auth/refresh`)
    ) {
      return throwError(() => error);
    }

    return this.authService.refreshToken().pipe(
      catchError(() => {
        return this.authService.logout();
      }),
      switchMap(() => {
        prevReq = this.addAuthHeader(prevReq);
        return next.handle(prevReq);
      })
    );
  }

  private addAuthHeader(req: HttpRequest<any>) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`,
      },
    });
  }
}
