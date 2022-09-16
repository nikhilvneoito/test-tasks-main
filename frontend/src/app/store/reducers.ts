import { UserActions, UserActionTypes } from './actions';
import { User } from './models';

export interface UserState {
  data: User[];
  isLoading: boolean;
  message: string;
}

const initialState: UserState = {
  data: [],
  isLoading: false,
  message: '',
};

export function reducer(state = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.GetUserLoad:
      return {
        ...state,
        isLoading: true,
      };
    case UserActionTypes.GetUserSuccess:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        message: 'Data fetched successfully',
      };
    case UserActionTypes.GetUserFail:
      return {
        data: [],
        message: 'Something went wrong',
        isLoading: false,
      };
    case UserActionTypes.PostUserLoad:
      return {
        ...state,
        isLoading: true,
      };
    case UserActionTypes.PostUserSuccess:
      const updatedData = [...state['data']];
      updatedData.push(action.payload);
      return {
        ...state,
        data: updatedData,
        isLoading: false,
        message: 'Data postede successfully',
      };
    case UserActionTypes.PostUserFail:
      return {
        data: [],
        message: 'Something went wrong',
        isLoading: false,
      };
    default:
      return state;
  }
}
