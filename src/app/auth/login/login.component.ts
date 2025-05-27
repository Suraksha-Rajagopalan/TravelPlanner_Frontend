import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
  console.log('Attempting login with:', this.email, this.password);
  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      console.log('Login successful', res);
      localStorage.setItem('user', JSON.stringify(res));
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error('Login failed', err);
      alert('Invalid credentials');
    }
  });
}

}
