import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/utils/user.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  baseUrl: string = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  createUser(userDetails: Partial<User>) {
    return this._http.post<any>(`${this.baseUrl}/users`, userDetails);
  }

  getUser(userId: number) {
    return firstValueFrom(
      this._http.get<any>(`${this.baseUrl}/users/${userId}`)
    );
  }

  updateUser(userDetails: Omit<User, 'color' | 'bio'>) {
    return this._http.put<any>(
      `${this.baseUrl}/users/${userDetails.id}`,
      userDetails
    );
  }

  deleteUser(userId: number) {
    return this._http.delete<any>(`${this.baseUrl}/users/${userId}`);
  }
}
