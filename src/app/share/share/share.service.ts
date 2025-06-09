import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShareService {
  private api = 'https://localhost:7251/api';

  constructor(private http: HttpClient) {}

  getAuthUrl() {
    return this.http.get<{ url: string }>(`${this.api}/share/url`);
  }

  sendEmail(payload: {
    accessToken: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    body: string;
  }) {
    return this.http.post(`${this.api}/email/send`, payload);
  }
}
