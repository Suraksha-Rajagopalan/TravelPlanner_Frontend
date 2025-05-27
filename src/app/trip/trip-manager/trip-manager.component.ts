import { Component } from '@angular/core';
import { Trip } from '../../models/trip';
import { TripFormComponent } from '../trip-form/trip-form.component';
import { TripListComponent } from '../trip-list/trip-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-trip-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TripFormComponent, TripListComponent],
  templateUrl: './trip-manager.component.html',
  styleUrl: './trip-manager.component.css'
})
export class TripManagerComponent {
  trips: Trip[] = [];

  constructor(private tripService: TripService) {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getTrips().subscribe({
      next: (data) => this.trips = data,
      error: (err) => console.error('Error fetching trips:', err)
    });
  }

  onTripAdded(trip: Trip) {
    this.tripService.addTrip(trip).subscribe({
      next: (newTrip) => {
        this.trips.push(newTrip);
      },
      error: (err) => console.error('Error adding trip:', err)
    });
  }
}
