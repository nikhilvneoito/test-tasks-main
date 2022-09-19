import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { UserProfileService } from '../components/user-profile/user-profile.service';
import { UsersListService } from '../components/users-list/users-list.service';
import * as fromUsers from '../store';
import { GETUserFail, GET_USERS, PAGEINIT, SEARCH_SORT_USER, User } from '../store';
import { NewHttpResponse } from '../utils/response.interface';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userListService: UsersListService,
    private userProfileService: UserProfileService
  ) { }

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PAGEINIT),
      switchMap(() =>
        from(this.userListService.getUsersList1('', '', 1).pipe(
          map((result: NewHttpResponse) => {
            return GET_USERS({ data: result });
          }),
          catchError((error) => of(GETUserFail(error)))
        )
        )
      )
    ))

  searchSortUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SEARCH_SORT_USER),
      switchMap(({ key, criteria, page }) =>
        from(this.userListService.getUsersList1(key, criteria, page).pipe(
          map((result: NewHttpResponse) => {
            return GET_USERS({ data: result });
          }),
          catchError((error) => of(GETUserFail(error)))
        )
        )
      )
    )
  )
}
