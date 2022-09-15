import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersListService {
  baseUrl: string = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  getUsersList() {
    return this._http.get<any>(`${this.baseUrl}/users`);
  }

  searchAndSortUsers(key: string, criteria: string) {
    return this._http.get<any>(
      `${this.baseUrl}/users?q=${key}&_sort=${criteria}`
    );
  }
}