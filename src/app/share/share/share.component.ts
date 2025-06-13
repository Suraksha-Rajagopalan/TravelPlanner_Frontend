import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShareService } from './share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './share.component.html',
})
export class ShareComponent {
  accessType: string = 'view';
  toEmail = '';
  subject = '';
  body = '';
  accessToken = '';
  fromEmail = '';
  trip: any;

  constructor(private shareService: ShareService,
    private router: Router
  ) {
    window.addEventListener('message', this.onTokenReceived.bind(this), false);
    const nav = this.router.getCurrentNavigation();
    this.trip = nav?.extras?.state?.['trip'];
  }

  openGmailLogin() {
    this.shareService.getAuthUrl().subscribe((res) => {
      window.open(res.url, '_blank', 'width=500,height=600');
    });
  }

  onTokenReceived(event: MessageEvent) {
    const token = event.data;
    if (token.access_token) {
      this.accessToken = token.access_token;
      this.getUserEmail(token.access_token);
    }
  }

  getUserEmail(token: string) {
    fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        this.fromEmail = user.email;
      });
  }

  sendEmail() {
    this.shareService
      .sendEmail({
        accessToken: this.accessToken,
        fromEmail: this.fromEmail,
        toEmail: this.toEmail,
        subject: this.subject,
        body: this.body,
      })
      .subscribe({
        next: () => alert('Email sent successfully'),
        error: (err) => alert('Failed to send email: ' + err.message),
      });
  }
}
