import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../trip.service';
import { Trip } from '../../models/trip';
import { AuthService } from '../../auth/auth.service';
import { CommonModule, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.css'],
  imports: [CommonModule, NgIf, NgFor],
})
export class TripDetailComponent implements OnInit {
  trip?: Trip;
  isAdded: boolean = false;
  errorMessage?: string;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const tripId = Number(this.route.snapshot.paramMap.get('id'));
    this.trip = this.tripService.getTripById(tripId);

    if (this.trip) {
      this.isAdded = this.tripService.getMyTrips().some(t => t.id === this.trip?.id);
      console.log('Trip loaded:', this.trip);
    } else {
      this.errorMessage = 'Trip not found';
    }
  }

  addToMyTrips(): void {
    if (!this.trip || this.isAdded) {
      return;
    }

    const userId = this.authService.getUserId();

    // Basic validation
    if (!userId || userId <= 0) {
      this.errorMessage = 'Invalid user ID';
      console.error('User ID is invalid:', userId);
      return;
    }

    // Log the token if needed
    console.log('Token:', localStorage.getItem('token'));

    // Create a copy of the trip with updated userId
    const newTrip: Trip = {
      ...this.trip,
      id: undefined, // Let the backend generate the ID
      userId: userId,
      startDate: this.trip.startDate || '2025-01-01',
      endDate: this.trip.endDate || '2025-01-05',
      travelMode: this.trip.travelMode || 'Not specified',
      notes: this.trip.notes || '',
      budget: this.trip.budget || 0,
      budgetDetails: this.trip.budgetDetails || { food: 0, hotel: 0 },
      essentials: this.trip.essentials || [],
      touristSpots: this.trip.touristSpots || []
    };

    console.log('Trip being saved:', newTrip);

    this.tripService.addTrip(newTrip).subscribe({
      next: (savedTrip) => {
        console.log('Trip saved successfully:', savedTrip);
        this.tripService.addToMyTrips(savedTrip); // Save locally too
        this.isAdded = true;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Failed to save trip. Please try again.';
        console.error('Error saving trip:', error);
      }
    });
  }
}
