import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Options } from 'src/app/utils/options.interface';
import { User } from 'src/app/utils/user.interface';
import { UsersListService } from './users-list.service';
import { debounceTime } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { USER_CONSTANTS } from 'src/app/utils/users.constant';
import { SNACKBAR_CONST } from 'src/app/utils/material.constant';

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
  dropDownOptions: Options[] = USER_CONSTANTS.DROP_DOWN;

  constructor(
    private _usersListService: UsersListService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getUsersList();
    this.searchedUser.pipe(debounceTime(200)).subscribe({
      next: (event: Event) => {
        this.searchUsers(event);
      },
    });
  }

  getUsersList() {
    this._usersListService.getUsersList().subscribe({
      next: (result: User[]) => {
        this.usersList = result;
      },
      error: (err: HttpErrorResponse) => {
        this.openSnackBar(err.statusText);
      },
    });
  }

  searchAndSort() {
    this._usersListService
      .searchAndSortUsers(this.searchKeyword, this.sortCriteria)
      .subscribe({
        next: (result: User[]) => {
          this.usersList = result;
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar(err.statusText);
        },
      });
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
