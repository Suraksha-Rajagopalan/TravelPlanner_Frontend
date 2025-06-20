import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';

  message: string = '';
  isError: boolean = false;

  passwordHasMinLength: boolean = false;
  passwordHasNumber: boolean = false;
  passwordHasUppercase: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    const trimmedName = this.name.trim();
    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password;

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      this.isError = true;
      this.message = 'All fields are required.';
      return;
    }

    this.authService.signup(trimmedName, trimmedEmail, trimmedPassword).subscribe({
      next: () => {
        this.isError = false;
        this.message = 'Profile created successfully! You can now login.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Signup error:', err);
        this.isError = true;
        this.message = 'Signup failed: ' + (err.error?.message || 'Unknown error');
      }
    });
  }

  checkPasswordStrength() {
    this.passwordHasMinLength = this.password.length >= 6;
    this.passwordHasNumber = /\d/.test(this.password);
    this.passwordHasUppercase = /[A-Z]/.test(this.password);
 }
}
