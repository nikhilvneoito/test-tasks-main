import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './reducers';

const getUserState = createFeatureSelector<UserState>('users');

export const getAllUsers = createSelector(getUserState, (state: UserState) => {
  return state;
});

export const firstTenUsers = createSelector(
  getUserState,
  (state: UserState) => {
    const users = state.data.slice(0, 10);
    return { ...state, data: users };
  }
);
