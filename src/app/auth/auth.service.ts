import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5276/api/Auth';
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ accessToken: string; refreshToken: string; user: { id: number; username: string; email: string; role: string } }> {
    return this.http.post<{ accessToken: string; refreshToken: string; user: { id: number; username: string; email: string; role: string } }>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }

  signup(name: string, email: string, password: string): Observable<{ message: string }> {
    const body = { name, email, password };
    return this.http.post<{ message: string }>(`${this.apiUrl}/signup`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    this.userSubject.next(null);
  }

  getCurrentUser() {
    return this.userSubject.value;
  }

  getUserId(): number {
    const user = this.getCurrentUser();
    return user?.id ? parseInt(user.id, 10) : 0;
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ accessToken: string }>(
      'http://localhost:5276/api/token/refresh',
      { refreshToken }
    );
  }

  setUser(user: any, token: string, refreshToken: string) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  private getUserFromStorage() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
