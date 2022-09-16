import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { User } from './models';

export enum UserActionTypes {
  GetUserLoad = '[USER] Get User',
  GetUserSuccess = '[USER] Get User Success',
  GetUserFail = '[USER] Get User Fail',
  PostUserLoad = '[USER] Post User',
  PostUserSuccess = '[USER] Post User Success',
  PostUserFail = '[USER] Post User Fail',
}

export class GetUserLoad implements Action {
  public readonly type = UserActionTypes.GetUserLoad;
}

export class GetUserSuccess implements Action {
  public readonly type = UserActionTypes.GetUserSuccess;
  constructor(public payload: User[]) {}
}

export class GetUserFail implements Action {
  public readonly type = UserActionTypes.GetUserFail;
  constructor(public error: HttpErrorResponse) {}
}

export class PostUserLoad implements Action {
  public readonly type = UserActionTypes.PostUserLoad;
  constructor(public payload: User) {}
}

export class PostUserSuccess implements Action {
  public readonly type = UserActionTypes.PostUserSuccess;
  constructor(public payload: User) {}
}

export class PostUserFail implements Action {
  public readonly type = UserActionTypes.PostUserFail;
  constructor(public error: HttpErrorResponse) {}
}

export type UserActions =
  | GetUserLoad
  | GetUserSuccess
  | GetUserFail
  | PostUserLoad
  | PostUserSuccess
  | PostUserFail;
