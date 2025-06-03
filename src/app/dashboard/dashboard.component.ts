import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { TripService } from '../trip/trip.service';
import { CommonModule } from '@angular/common';
import { SampleTripsComponent } from '../components/sample-trips/sample-trips.component';
import { TripListComponent } from '../trip/trip-list/trip-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SampleTripsComponent, TripListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  trips: Trip[] = [];
  username: string = '';
  isLoggedIn: boolean = false;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private tripService: TripService, private router: Router) {}

  ngOnInit(): void {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    this.username = user.username;
    this.isLoggedIn = true;
  }

  this.tripService.getTrips().subscribe({
    next: (trips) => {
      this.trips = trips;
      this.loading = false;
    },
    error: () => {
      this.errorMessage = 'Failed to load trips. Please try again later.';
      this.loading = false;
    }
  });
}


  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfileDetails');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  onLoginButtonClick() {
    console.log("Login button clicked");
    this.router.navigate(['/login']);
  }

  ViewProfile() {
    console.log("Viewing Profile");
    this.router.navigate(['/profile']);
  }

  TripCreation() {
    console.log("Creating Trip");
    this.router.navigate(['/trip-form']);
  }

  editTrip(trip: Trip): void {
    this.router.navigate(['/trip-edit'], { queryParams: { id: trip.id } });
  }

  viewTrip(tripId?: number | string): void {
    if (tripId === undefined || tripId === null) return;
    this.router.navigate(['/trip-details', tripId]);
  }

  addToMyTrips(trip: Trip): void {
    this.tripService.addToMyTrips(trip);
    alert(`Trip "${trip.title}" added to My Trips!`);
  }

  // For popular trips  
  onTripSelected(trip: Trip): void {
    this.router.navigate(['/trip-details', trip.id]); 
  }

  // For my trips
  myTripSelected(trip: Trip): void {
    this.router.navigate(['/trip-list', trip.id]);
  }
}
