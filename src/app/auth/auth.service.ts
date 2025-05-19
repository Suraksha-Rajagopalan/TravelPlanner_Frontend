import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7251/api/Auth'; 

  constructor(private http: HttpClient) {}

  //  Sending HTTP POST request to backend
  login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { email, password });
}

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { name, email, password });
  }
}
