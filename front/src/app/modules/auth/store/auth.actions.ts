import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ email: string; password: string }>()
);

export const authSuccess = createAction('[Auth] Failure');
export const authFailure = createAction(
  '[Auth] Success',
  props<{ authError: string }>()
);

export const clearAuthError = createAction('[Auth] Clear error');

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout success');
