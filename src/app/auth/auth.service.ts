import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7251/api/Auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<{ token: string }> {
    const body = { email, password };
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  signup(name: string, email: string, password: string): Observable<{ message: string }> {
    const body = { name, email, password };
    return this.http.post<{ message: string }>(`${this.apiUrl}/signup`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.id ? parseInt(user.id, 10) : 0;
  }

  // For navbar to get the role for admin page
  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }


}
