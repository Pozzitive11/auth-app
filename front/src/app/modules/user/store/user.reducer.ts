import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { User } from '../models';

export interface UserState {
  currentUser: User;
}

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
