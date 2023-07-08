import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../models';

const selectError = createFeatureSelector<AuthState>('error');

export const selectAuthError = createSelector(
  selectError,
  (state: AuthState) => {
    return state.authError;
  }
);
