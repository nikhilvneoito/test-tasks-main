import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { NewHttpResponse } from 'src/app/utils/response.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersListService {
  baseUrl: string = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  getUsersList(
    key: string,
    criteria: string,
    pageNum: number,
    limit: number = 12
  ) {
    return this._http.get<any>(
      `${this.baseUrl}/users?q=${key}&_sort=${criteria}&_page=${pageNum}&_limit=${limit}`,
      { observe: 'response' }
    );
  }

  getUsersList1(
    key: string,
    criteria: string,
    pageNum: number,
    limit: number = 12
  ): Observable<NewHttpResponse> {
    return this._http.get<any>(
      `${this.baseUrl}/users?q=${key}&_sort=${criteria}&_page=${pageNum}&_limit=${limit}`,
      { observe: 'response' }
    ).pipe(
      map((result) => {
        let first: string = '';
        let next: string = '';
        let prev: string = '';
        let last: string = '';
        let response = result.headers.get('Link');
        let totalCount = parseInt(result.headers.get('X-Total-Count')!);
        let commaSplitted: string[] = response!.split(', ');
        for (let item of commaSplitted) {
          let semicolonsplit = item.split('; rel=');
          switch (semicolonsplit[1].substring(
            1,
            semicolonsplit[1].length - 1
          )) {
            case 'first':
              first = semicolonsplit[0].substring(
                1,
                semicolonsplit[0].length - 1
              )
              break
            case 'prev':
              prev = semicolonsplit[0].substring(
                1,
                semicolonsplit[0].length - 1
              )
              break
            case 'next':
              next = semicolonsplit[0].substring(
                1,
                semicolonsplit[0].length - 1
              )
              break
            case 'last':
              last = semicolonsplit[0].substring(
                1,
                semicolonsplit[0].length - 1
              )
              break
          }
        }
        const currentLimit = parseInt(
          last.substring(
            last.length - 2,
            last.length
          )
        );
        return {
          users: result.body,
          firstPage: first,
          prevPage: prev,
          nextPage: next,
          lastPage: last,
          pageSize: currentLimit,
          totalLengthPage: totalCount
        }
      })
    )
  }

  searchAndSortUsers(
    key: string,
    criteria: string,
    pageNum: number,
    limit: number = 12
  ) {
    return this._http.get<any>(
      `${this.baseUrl}/users?q=${key}&_sort=${criteria}&_page=${pageNum}&_limit=${limit}`
    );
  }
}
