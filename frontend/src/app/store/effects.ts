import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { UsersListService } from '../components/users-list/users-list.service';
import { GETUserFail, GET_USERS, PAGEINIT, SEARCH_SORT_USER } from '../store';
import { NewHttpResponse } from '../utils/response.interface';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userListService: UsersListService,
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
