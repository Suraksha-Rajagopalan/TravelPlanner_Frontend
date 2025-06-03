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
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('user');

  this.authService.login(this.email, this.password).subscribe({
    next: (res: { token: string }) => {
      console.log('Login successful', res);
      localStorage.setItem('token', res.token); 
      localStorage.setItem('jwtToken', res.token);
      setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 0);

      // Decode the token manually
      const payload = JSON.parse(atob(res.token.split('.')[1]));
      const user = {
        username: payload.unique_name || payload.username,
        email: payload.email,
        id: parseInt(payload.nameid, 10) || parseInt(payload.id, 10) // just in case
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error('Login failed', err);
      alert('Invalid credentials');
    }
  });
}

}
