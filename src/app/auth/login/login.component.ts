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
    this.emailError = null;
    this.passwordError = null;

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        this.authService.setUser(res.user, res.accessToken, res.refreshToken);

        if (res.user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);

        }
      },
      error: (err) => {
        console.error('Login failed', err);
        const message = err?.error?.error || err?.error?.message || 'Invalid credentials';

        if (message.toLowerCase().includes('email')) {
          this.emailError = message;
        } else if (message.toLowerCase().includes('password')) {
          this.passwordError = message;
        } else {
          this.emailError = 'Invalid email or password';
          this.passwordError = 'Invalid email or password';
        }
      }
    });
  }
}