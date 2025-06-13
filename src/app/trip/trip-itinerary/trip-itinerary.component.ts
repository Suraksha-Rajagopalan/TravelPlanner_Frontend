import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../trip.service';
import { ReactiveFormsModule } from '@angular/forms';



interface ItineraryItem {
  id?: number;
  title: string;
  description: string;
  scheduledDateTime: string;
}

@Component({
  selector: 'app-trip-itinerary',
  standalone: true,
  templateUrl: './trip-itinerary.component.html',
  styleUrls: ['./trip-itinerary.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})


export class TripItineraryComponent implements OnInit {
  tripId!: number;
  itinerary: ItineraryItem[] = [];

  newItem: ItineraryItem = {
    title: '',
    description: '',
    scheduledDateTime: '',
  };
formGroup: any;

  constructor(private tripService: TripService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.tripId = +this.route.snapshot.paramMap.get('id')!;
    this.loadItinerary();
  }

  loadItinerary(): void {
    this.tripService.getItinerary(this.tripId).subscribe({
      next: (data: any) => (this.itinerary = data),
      error: (err) => console.error('Failed to load itinerary', err),
    });
  }

  addItineraryItem(): void {
    const { title, description, scheduledDateTime } = this.newItem;

    if (!title || !scheduledDateTime) {
      console.warn('Title or date is missing');
      return;
    }

    const isoDate = new Date(scheduledDateTime).toISOString();
    if (isNaN(Date.parse(isoDate))) {
      console.error('Invalid datetime');
      return;
    }

    const itemToSend = {
      title: title.trim(),
      description: description?.trim() || '',
      scheduledDateTime: isoDate,
    };

    this.tripService.addItineraryItem(this.tripId, itemToSend).subscribe({
      next: () => {
        this.loadItinerary();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding itinerary item', err.error || err);
      },
    });
  }

  resetForm(): void {
    this.newItem = { title: '', description: '', scheduledDateTime: '' };
  }
}
