import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { NewHttpResponse } from '../utils/response.interface';

export const PAGEINIT = createAction(
  '[APP] App Init'
)

export const GET_USERS = createAction(
  '[USER] User GET Sucess',
  props<{ data: NewHttpResponse }>()
)

export const SEARCH_SORT_USER = createAction(
  '[USER] Search User',
  props<{ key: string, criteria: string, page: number }>(),
)

export const GETUserFail = createAction(
  '[USER] User GET Fail',
  props<{ error: HttpErrorResponse }>()
)
