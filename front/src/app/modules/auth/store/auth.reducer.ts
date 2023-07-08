import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '.';
import { AuthState } from '../models';

const initialState: AuthState = {
  authError: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.authFailure, (state, { authError }) => ({
    ...state,
    authError,
  })),
  on(AuthActions.authSuccess, (state) => (state = initialState)),
  on(AuthActions.clearAuthError, (state) => (state = initialState))
);
