import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5276/api/Auth';
  private userSubject: BehaviorSubject<any>;
  public user$: Observable<any>;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const storedUser = this.getUserFromCookies();
    this.userSubject = new BehaviorSubject<any>(storedUser);
    this.user$ = this.userSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => response.result),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  signup(name: string, email: string, password: string): Observable<any> {
    const body = { name, email, password };
    return this.http.post<any>(`${this.apiUrl}/signup`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(response => response.result),
      catchError(error => {
        console.error('Signup failed:', error);
        return throwError(() => new Error('Signup failed. Please try again later.'));
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.cookieService.get('refreshToken');

    return this.http.post<any>(
      'http://localhost:5276/api/Token/refresh',
      { refreshToken },
      { withCredentials: true }
    ).pipe(
      map(response => response.result),
      catchError(error => {
        console.error('Token refresh failed:', error);
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }


  logout(): void {
    this.cookieService.delete('user');
    this.cookieService.delete('jwtToken');
    this.cookieService.delete('refreshToken');
    this.userSubject.next(null);
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }

  getUserId(): number {
    const user = this.getCurrentUser();
    return user?.id ? Number(user.id) : 0;
  }

  setUser(user: any, token: string, refreshToken: string): void {
    const expires = 7; // 7 days
    this.cookieService.set('jwtToken', token, expires, '/');
    this.cookieService.set('refreshToken', refreshToken, expires, '/');
    this.cookieService.set('user', JSON.stringify(user), expires, '/');
    this.userSubject.next(user);
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get('jwtToken');
  }

  getJwtToken(): string {
    return this.cookieService.get('jwtToken');
  }

  private getUserFromCookies(): any {
    try {
      const userJson = this.cookieService.get('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.warn('Failed to parse user from cookies:', e);
      return null;
    }
  }
}
