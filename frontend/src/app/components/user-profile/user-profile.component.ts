import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/utils/user.interface';
import { UserProfileService } from './user-profile.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { USER_CONSTANTS } from 'src/app/utils/users.constant';
import { SNACKBAR_CONST } from 'src/app/utils/material.constant';
import { ROUTE_CONST } from 'src/app/utils/misc.constant';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userDetailForm: FormGroup = new FormGroup({});
  submitted = false;
  forCreation: boolean = false;
  currentUser: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: UserProfileService,
    private _snackBar: MatSnackBar,
  ) {
    if (this.route.snapshot.params['id'] === USER_CONSTANTS.NEW_USER) {
      this.forCreation = true;
    } else this.forCreation = false;
  }

  ngOnInit(): void {
    this.userDetailForm = this.formBuilder.group({
      name: ['', Validators.required],
      statusMessage: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [0, [Validators.required, Validators.min(1)]],
      isPublic: [false],
      avatarUrl: [''],
    });
    if (this.route.snapshot.params['id'] !== USER_CONSTANTS.NEW_USER) {
      this.getUser();
    }
  }

  get f() {
    return this.userDetailForm.controls;
  }

  async getUser() {
    this.currentUser = await this.profileService.getUser(
      this.route.snapshot.params['id']
    );
    this.f['name'].setValue(this.currentUser?.name);
    this.f['statusMessage'].setValue(this.currentUser?.statusMessage);
    this.f['email'].setValue(this.currentUser?.email);
    this.f['age'].setValue(this.currentUser?.age);
    this.f['isPublic'].setValue(this.currentUser?.isPublic);
    this.f['avatarUrl'].setValue(this.currentUser?.avatarUrl ?? '');
  }

  onSubmit() {
    this.submitted = true;
    if (this.userDetailForm.invalid) {
      this.openSnackBar(SNACKBAR_CONST.CHECK_FIELDS_MSG);
      return;
    }
    let userDetails: Partial<User> = {
      name: this.f['name'].value,
      statusMessage: this.f['statusMessage'].value,
      age: this.f['age'].value,
      email: this.f['email'].value,
      isPublic: this.f['isPublic'].value,
      avatarUrl: this.f['avatarUrl'].value,
    };
    if (this.forCreation) {
      this.profileService.createUser(userDetails).subscribe({
        next: (user: User) => {
          this.openSnackBar(`User created successfully`);
          this.router.navigate([ROUTE_CONST.USERS_LIST]);
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar(err.statusText);
        },
      });
    } else {
      userDetails['id'] = this.currentUser?.id;
      userDetails['createdAt'] = this.currentUser?.createdAt;
      this.profileService.updateUser(userDetails).subscribe({
        next: () => {
          this.openSnackBar(`User updated successfully`);
          this.router.navigate([ROUTE_CONST.USERS_LIST]);
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar(err.statusText);
        },
      });
    }
  }

  deleteUser() {
    this.profileService.deleteUser(this.currentUser!.id).subscribe({
      next: () => {
        this.openSnackBar(SNACKBAR_CONST.DELETE_USER_MSG);
        this.router.navigate([ROUTE_CONST.USERS_LIST]);
      },
      error: (err: HttpErrorResponse) => {
        this.openSnackBar(err.statusText);
      },
    });
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
}
