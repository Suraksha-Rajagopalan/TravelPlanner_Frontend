import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.username = user.username;
      this.isLoggedIn = true;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfileDetails');
    this.isLoggedIn = false;
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
}
