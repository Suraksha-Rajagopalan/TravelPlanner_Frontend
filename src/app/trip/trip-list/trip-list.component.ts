import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Trip } from '../../models/trip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../trip.service';
import { TripEditComponent } from '../trip-edit/trip-edit.component';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [FormsModule, CommonModule, TripEditComponent],
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent {
  @Input() trips: Trip[] = [];
  @Output() tripSelected = new EventEmitter<Trip>();

  newActivity: string = '';
  selectedTrip: Trip | null = null;

  constructor(private tripService: TripService) {}

  editTrip(trip: Trip) {
    this.selectedTrip = { ...trip };
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
}
