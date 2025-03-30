import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../utils/constants';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {  HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  BASE_URL = BASE_URL;
  constructor(private readonly http: HttpClient) {}
  get<T>(path: string, headers?: any) {
    return this.http.get<T>(`${this.BASE_URL}/${path}`, { headers });
  }

  post<T>(path: string, body: any, headers?: any): Observable<T> {
    return this.http.post<T>(`${this.BASE_URL}/${path}`, body, { headers, observe: 'response' })
      .pipe(
        map((res) => res.body as T),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error); 
        })
      );
  }
  
  put<T>(path: string, body: any, headers?: any) {
    return this.http.put<T>(`${this.BASE_URL}/${path}`, body, { headers });
  }

  patch<T>(path: string, body: any, headers?: any) {
    return this.http.patch<T>(`${this.BASE_URL}/${path}`, body, { headers,observe: 'response' });
  }

  delete<T>(path: string, headers?: any) {
    return this.http.delete<T>(`${this.BASE_URL}/${path}`, { headers });
  }
}
