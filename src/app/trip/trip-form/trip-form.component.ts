import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripService } from '../../trip/trip.service';
import { Trip } from '../../models/trip';
import { AuthService } from '../../auth/auth.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  standalone: true,
})
export class TripFormComponent {
  @Output() tripAdded = new EventEmitter<Trip>();

  constructor(private router: Router, 
    private tripService: TripService, 
    private authService: AuthService) {}

  trip: Trip = this.resetTrip();

  resetTrip(): Trip {
    return {
      //id: Date.now(),
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      itinerary: [],
      userId: 0,
    };
  }

  onSubmit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    const newTrip = { ...this.trip, id: Date.now(), itinerary: [] };

    this.tripService.addTrip(newTrip).subscribe({
      next: (createdTrip) => {
        this.tripAdded.emit(createdTrip); 
        this.trip = this.resetTrip();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error adding trip:', err);
        alert('Failed to add trip. Please try again.');
      }
    });
  }
}
