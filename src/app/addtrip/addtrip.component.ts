import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-entry',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './addtrip.component.html',
  styleUrls: ['./addtrip.component.css']
})
export class AddTripComponent {
  trip = {
    title: '',
    subtitle: '',
    price: null,
    notes: ''
  };

  trips: any[] = [];

  saveTrip() {
    // Simple validation
    if (!this.trip.title || !this.trip.subtitle || this.trip.price == null) {
      alert('Please fill in all required fields.');
      return;
    }

    // Save a copy to the trip list
    this.trips.push({ ...this.trip });

    // Log it for now
    console.log('Trip saved:', this.trip);

    // Optionally clear the form
    this.trip = {
      title: '',
      subtitle: '',
      price: null,
      notes: ''
    };
  }
}
