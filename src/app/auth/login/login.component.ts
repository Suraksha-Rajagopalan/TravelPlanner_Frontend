import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  emailError: string | null = null;
  passwordError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');

    // Clear previous error messages
    this.emailError = null;
    this.passwordError = null;

    this.authService.login(this.email, this.password).subscribe({
      next: (res: { token: string }) => {
        console.log('Login successful', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('jwtToken', res.token);

        // Decode token
        const payload = JSON.parse(atob(res.token.split('.')[1]));
        const user = {
          username: payload.unique_name || payload.username,
          email: payload.email,
          id: parseInt(payload.nameid, 10) || parseInt(payload.id, 10),
        };
        localStorage.setItem('user', JSON.stringify(user));

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed', err);

        const message =
          err?.error?.error || err?.error?.message || 'Invalid credentials';

        if (message.toLowerCase().includes('email')) {
          this.emailError = message;
        } else if (message.toLowerCase().includes('password')) {
          this.passwordError = message;
        } else {
          this.emailError = 'Invalid email or password';
          this.passwordError = 'Invalid email or password';
        }
      },
    });
  }
}
