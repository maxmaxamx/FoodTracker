import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { User } from '../utils/identifiers';
export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private loginApi: string = 'api/login';
  private registerApi: string = 'api/register';

  login(info: User) {
    return this.http.post<AuthResponse>(this.loginApi, info);
  }

  sendCode(code: string) {
    const params = new HttpParams().set('code', code);

    return this.http.get<number>('api/code', { params })
  }
}
