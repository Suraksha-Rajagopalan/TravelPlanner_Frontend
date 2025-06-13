import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  template: `<p>Processing OAuth callback...</p>`
})
export class OauthCallbackComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = {
      access_token: params.get('access_token'),
      token_type: params.get('token_type'),
      expires_in: params.get('expires_in'),
      scope: params.get('scope')
    };

    // Send token back to the opener window
    if (window.opener) {
      window.opener.postMessage(token, '*');
      window.close();
    } else {
      console.error('No window opener found');
      this.router.navigate(['/']);
    }
  }
}
