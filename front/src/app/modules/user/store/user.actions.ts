import { createAction, props } from '@ngrx/store';
import { User } from '../models';

export const loadUser = createAction(
  '[User] Load user',
  props<{ id: number }>()
);

export const loadUserSuccess = createAction(
  '[User] Load user Success',
  props<User>()
);
export const clearUser = createAction('[User] Clear user');
