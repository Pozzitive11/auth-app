import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { Observable, map, mergeMap } from 'rxjs';
import { User } from '../models';
import { environment } from '@environments/environment.development';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(({ id }) => this.getUserById(id)),
      map(({ id, email }) => UserActions.loadUserSuccess({ id, email }))
    )
  );

  private getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/id/${id}`);
  }
}
