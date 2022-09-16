import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { UserProfileService } from '../components/user-profile/user-profile.service';
import { UsersListService } from '../components/users-list/users-list.service';
import * as fromUsers from '../store';
import { User } from '../store';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userListService: UsersListService,
    private userProfileService: UserProfileService
  ) {}

  getUsers$: Observable<Action> = this.actions$.pipe(
    ofType(fromUsers.UserActionTypes.GetUserLoad),
    mergeMap(() =>
      this.userListService.getUsersList('', '', 1).pipe(
        map((result: HttpResponse<any>) => {
          return new fromUsers.GetUserSuccess(result.body);
        }),
        catchError((error) => of(new fromUsers.GetUserFail(error)))
      )
    )
  );

  postUser$: Observable<Action> = this.actions$.pipe(
    ofType(fromUsers.UserActionTypes.PostUserLoad),
    map((action: fromUsers.PostUserLoad) => action.payload),
    mergeMap(() =>
      this.userProfileService.createUser({}).pipe(
        map((user: User) => {
          return new fromUsers.PostUserLoad(user);
        }),
        catchError((error) => of(new fromUsers.PostUserFail(error)))
      )
    )
  );
}
