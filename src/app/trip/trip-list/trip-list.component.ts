import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../models/trip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css'
})
export class TripListComponent {
  @Input() trips: Trip[] = [];

  newActivity: string = '';
  selectedTrip: Trip | null = null;

  constructor(private tripService: TripService) {}

  editTrip(trip: Trip) {
    this.selectedTrip = { ...trip };
  }

  saveTripEdits() {
    if (this.selectedTrip) {
      this.tripService.updateTrip(this.selectedTrip).subscribe({
        next: () => {
          const index = this.trips.findIndex(t => t.id === this.selectedTrip!.id);
          if (index > -1) this.trips[index] = { ...this.selectedTrip! };
          this.selectedTrip = null;
        },
        error: (err) => console.error('Error updating trip:', err)
      });
    }
  }

  cancelEdit() {
    this.selectedTrip = null;
  }

  toggleItinerary(trip: Trip) {
    trip.showItinerary = !trip.showItinerary;
  }

  addActivity(trip: Trip) {
    if (this.newActivity.trim()) {
      const day = trip.itinerary.length + 1;
      trip.itinerary.push({ day, activity: this.newActivity });
      this.newActivity = '';
    }
  }
}
