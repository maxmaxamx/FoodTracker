import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { EventEmitter, inject, Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { User } from '../utils/identifiers';
import { Router } from '@angular/router';
export interface AuthResponse {
  authorized: boolean,
  email: string,
  username: string
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private loginApi: string = '/api/login';
  private registerApi: string = '/api/register';
  protected router: Router = inject(Router);


  isAuthorized = signal<boolean>(false);
  currentUser = signal<string | null>(null);
  currentName = signal<string | null>(null);

  checkAuth() {
    return this.http.get<AuthResponse>(
      '/api/isMe',
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        this.isAuthorized.set(res.authorized);
        this.currentUser.set(res.email);
        this.currentName.set(res.username);
        console.log('auth', this.isAuthorized(), this.currentUser(), this.currentName());
      }),
      catchError((err) => {
        this.isAuthorized.set(false);
        this.currentUser.set(null);
        this.currentName.set(null);
        return throwError(() => err);
      }
      ));
  }

  logout() {
    return this.http.post('/api/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        this.isAuthorized.set(false);
        this.currentUser.set(null);
        this.currentName.set(null);
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Logout error:', err)
    });
  }


  login(info: User) {
    return this.http.post<AuthResponse>(this.loginApi, info, { withCredentials: true });
  }

  signup(info: User) {
    return this.http.post<AuthResponse>(this.registerApi, info, { withCredentials: true });
  }

  sendCode(code: string) {
    const params = new HttpParams().set('code', code);

    return this.http.get<number>('/api/check', { params, withCredentials: true })
  }
}
