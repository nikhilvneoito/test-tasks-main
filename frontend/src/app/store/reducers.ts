import { createReducer, on } from '@ngrx/store';
import { NewHttpResponse } from '../utils/response.interface';
import { GETUserFail, GET_USERS, PAGEINIT } from './actions';

export interface UserState {
  data: NewHttpResponse;
  isLoading: boolean;
  message: string;
  hasError?: boolean;
  error?: string;
}

const initialState: UserState = {
  data: {
    firstPage: '',
    lastPage: '',
    nextPage: '',
    pageSize: 0,
    prevPage: '',
    totalLengthPage: 0,
    users: []
  },
  isLoading: false,
  message: '',
  hasError: false,
  error: ''
};

export const userReducer = createReducer(
  initialState,
  on(PAGEINIT, () => ({
    data: {
      firstPage: '',
      lastPage: '',
      nextPage: '',
      pageSize: 0,
      prevPage: '',
      totalLengthPage: 0,
      users: []
    },
    isLoading: true,
    message: 'App initializing',
    hasError: false,
    error: ''
  })),
  on(GET_USERS, (state, { data }) => ({
    ...state,
    data: data,
    isLoading: false,
    message: 'Successfully fetched User details'
  })),
  on(GETUserFail, (state, { error }) => ({
    ...state,
    message: 'Failed to fetch data: ',
    hasError: true,
    error: error.message ?? error.error.message
  })),
)
