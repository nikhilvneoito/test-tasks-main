import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Options } from 'src/app/utils/options.interface';
import { User } from 'src/app/utils/user.interface';
import { debounceTime } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { USER_CONSTANTS } from 'src/app/utils/users.constant';
import { SNACKBAR_CONST } from 'src/app/utils/material.constant';
import { PageEvent } from '@angular/material/paginator';
import { select, Store } from '@ngrx/store';
import { getUsers, PAGEINIT, SEARCH_SORT_USER } from 'src/app/store';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  searchKeyword: string = '';
  sortCriteria: string = '';
  searchedUser = new Subject<Event>();
  usersList: User[] = [];
  dropDownOptions: Options[] = USER_CONSTANTS.SORT_BY_DROP_DOWN;
  pageEvent: PageEvent = new PageEvent();
  pageNumber: number = 1;
  pageSize: number = 10;
  prevLink: string = '';
  nextLink: string = '';
  lastLink: string = '';
  totalLengthPage: number = 0;


  constructor(
    private _snackBar: MatSnackBar,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(PAGEINIT())
    this.store.pipe(select(getUsers)).subscribe({
      next: (res: any) => {
        this.usersList = res.users;
        this.pageSize = res.pageSize;
        this.totalLengthPage = res.totalLengthPage;
      }
    })
    this.searchedUser.pipe(debounceTime(200)).subscribe({
      next: (event: Event) => {
        this.searchUsers(event);
      },
    });
  }

  changePage(event: PageEvent) {
    this.store.dispatch(SEARCH_SORT_USER({ key: this.searchKeyword, criteria: this.sortCriteria, page: event.pageIndex + 1 }))
  }

  searchAndSort() {
    this.store.dispatch(SEARCH_SORT_USER({ key: this.searchKeyword, criteria: this.sortCriteria, page: this.pageNumber }))
  }

  searchUsers(event: Event) {
    this.searchKeyword = (event.target as HTMLInputElement).value;
    this.searchAndSort();
  }

  sortUsers(event: MatSelectChange) {
    this.sortCriteria = event.value;
    this.searchAndSort();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition:
        SNACKBAR_CONST.HORIZONTAL_POS as MatSnackBarHorizontalPosition,
      verticalPosition:
        SNACKBAR_CONST.VERTICAL_POS as MatSnackBarVerticalPosition,
    });
  }

  trackByFunc(index: number, item: User) {
    return index;
  }
}
