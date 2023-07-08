import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../models';

const getUserFeatureState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
  getUserFeatureState,
  (state: UserState) => state.currentUser
);
