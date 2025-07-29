import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent implements OnInit {
  username: string = '';
  isLoggedIn: boolean = false;
  user: any = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
    });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onLoginButtonClick(): void {
    this.router.navigate(['/login']);
  }

  ViewProfile(): void {
    this.router.navigate(['/profile']);
  }

  TripCreation(): void {
    this.router.navigate(['/trip-form']);
  }

  goToTripReviews(): void {
    this.router.navigate(['/trip-reviews']);
  }

  goToHome(): void {
    this.router.navigate(['/dashboard']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
