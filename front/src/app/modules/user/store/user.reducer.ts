import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { UserState } from '../models';

export const initialState: UserState = {
  currentUser: null,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUserSuccess, (state, currentUser) => ({
    ...state,
    currentUser,
  })),
  on(UserActions.clearUser, (state) => (state = initialState))
);
