import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Trip } from '../models/trip';
import { TripService } from '../trip/trip.service';
import { CommonModule } from '@angular/common';
import { SampleTripsComponent } from '../components/sample-trips/sample-trips.component';
import { TripListComponent } from '../trip/trip-list/trip-list.component';
import { RateTripComponent } from '../rating/rate-trip/rate-trip.component';
import { AuthService } from '../auth/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SampleTripsComponent, TripListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  trips: Trip[] = [];
  sharedTrips: Trip[] = [];
  currentUser: any;
  username: string = '';
  isLoggedIn: boolean = false;
  loading: boolean = true;
  errorMessage: string = '';
  destroy$ = new Subject<void>();

  constructor(private tripService: TripService, private router: Router,
    private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      console.log('Current User:', user);

      if (user) {
        this.username = user.username;
        this.isLoggedIn = true;

        // Load user's own trips
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

        // Load shared trips
        this.tripService.getSharedTrips().subscribe({
          next: (shared: Trip[]) => {
            this.sharedTrips = shared;
          },
          error: () => {
            console.error("Failed to load shared trips");
          }
        });
      }
    });
  }


  // for popular trips- not being used need to remove it
  viewTrip(tripId?: number | string): void {
    if (tripId === undefined || tripId === null) return;
    this.router.navigate(['/trip-details', tripId]);
  }

  // for popular trips
  addToMyTrips(trip: Trip): void {
    this.tripService.addToMyTrips(trip);
    alert(`Trip "${trip.title}" added to My Trips!`);
  }

  myTripSelected(event: { action: 'view' | 'edit', trip: Trip }): void {
    const { action, trip } = event;

    if (action === 'view') {
      this.router.navigate(['/trip-details', trip.id]);
    } else if (action === 'edit') {
      console.log('Edit action triggered for trip:', trip);
      this.router.navigate(['/trip-edit', trip.id]);
    }
  }

  // For popular trips  
  onTripSelected(trip: Trip): void {
    this.router.navigate(['/trip-details', trip.id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
