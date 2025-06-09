import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Trip } from '../../models/trip';
import { Review } from '../../models/trip';
import { TripService } from '../trip.service';
import { RateTripComponent } from '../../rating/rate-trip/rate-trip.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnChanges {
  @Input() trips: Trip[] = [];
  @Output() tripSelected = new EventEmitter<{ action: 'view' | 'edit', trip: Trip }>();

  newActivity: string = '';
  selectedTrip: Trip | null = null;
  private userId: number = 0;

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.userId = this.authService.getUserId();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trips'] && this.trips && this.trips.length > 0) {
      this.loadReviewsForTrips();
    }
  }

  private loadReviewsForTrips() {
  this.trips.forEach(trip => {
    if (trip.id !== undefined && trip.id !== null) {
      this.tripService.getReview(trip.id).subscribe({
        next: (review: Review | null) => {
          if (review && review.userId === this.userId) {
            trip.rating = review.rating;
            trip.review = review.reviewText; 
          } else {
            trip.rating = 0;
            trip.review = '';
          }
        },
        error: () => {
          trip.rating = 0;
          trip.review = '';
        }
      });
    } else {
      trip.rating = 0;
      trip.review = '';
    }
  });
}

  selectTrip(action: 'view' | 'edit', trip: Trip): void {
    this.tripSelected.emit({ action, trip });
  }

  shareTrip(trip: Trip) {
    this.router.navigate(['/share'], { state: { trip } });
  }

  saveTripEdits(updatedTrip: Trip) {
    this.tripService.updateTrip(updatedTrip).subscribe({
      next: () => {
        const index = this.trips.findIndex(t => t.id === updatedTrip.id);
        if (index > -1) {
          this.trips[index] = { ...updatedTrip };
        }
        this.selectedTrip = null;
      },
      error: (err) => console.error('Error updating trip:', err)
    });
  }

  cancelEdit() {
    this.selectedTrip = null;
  }

  toggleItinerary(trip: Trip) {
    trip.showItinerary = !trip.showItinerary;
  }

  addActivity(trip: Trip) {
    if (this.newActivity.trim()) {
      if (!trip.itinerary) {
        trip.itinerary = [];
      }
      const day = trip.itinerary.length + 1;
      trip.itinerary.push({ day, activity: this.newActivity });
      this.newActivity = '';
    }
  }

  deleteTrip(trip: Trip) {
    if (trip.id !== undefined && confirm(`Are you sure you want to delete the trip "${trip.title}"?`)) {
      this.tripService.deleteTrip(trip.id).subscribe({
        next: () => {
          this.trips = this.trips.filter(t => t.id !== trip.id);
        },
        error: (err) => {
          console.error('Error deleting trip:', err);
          alert('Failed to delete the trip. Please try again.');
        }
      });
    }
  }

  openRatingModal(trip: Trip) {
    const dialogRef = this.dialog.open(RateTripComponent, {
      width: '400px',
      data: { tripId: trip.id }
    });

    dialogRef.afterClosed().subscribe((result: { rating: number; review: string }) => {
      if (result && trip.id != null) {
        const { rating, review } = result;
        this.tripService.submitRatingAndReview(trip.id, rating, review).subscribe(() => {
          trip.rating = rating;
          trip.review = review;
        });
      }
    });
  }
}
