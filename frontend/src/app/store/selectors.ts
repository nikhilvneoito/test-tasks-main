import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { UserState } from './reducers';

export const getUsersFromState = (state: AppState) => state.users;

export const getUsers = createSelector(
  getUsersFromState,
  (state: UserState) => state.data
)
