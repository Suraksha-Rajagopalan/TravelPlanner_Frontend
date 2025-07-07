import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

import { TripService } from '../trip.service';
import { ItineraryItem, ItineraryItemCreate } from '../../models/itinerary';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-trip-itinerary',
  standalone: true,
  templateUrl: './trip-itinerary.component.html',
  styleUrls: ['./trip-itinerary.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule
  ]
})
export class TripItineraryComponent implements OnInit {
  private authService = inject(AuthService);

  tripId!: number;
  userId!: number;
  itinerary: ItineraryItem[] = [];
  isViewOnly: boolean = false;
  isOwner: boolean = false;
  accessLevel: string = 'View';

  formGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    scheduledDateTime: new FormControl('', Validators.required)
  });

  constructor(
    private tripService: TripService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('tripId');
    const parsedId = Number(idParam);

    if (!idParam || isNaN(parsedId) || parsedId <= 0) {
      console.error('Invalid trip ID in route:', idParam);
      return;
    }

    this.tripId = parsedId;

    this.route.queryParams.subscribe(params => {
      this.accessLevel = params['accessLevel'] ?? 'View';
    });

    this.userId = this.authService.getUserId();

    this.tripService.getTripByIdFromBackend(this.tripId).subscribe(trip => {
      //console.log(trip.userId, this.userId);
      this.isOwner = trip.userId === this.userId;
    });

    //console.log("Owner",this.isOwner,"Access Level", this.accessLevel);

      this.loadItinerary();
    }

  loadItinerary(): void {
      this.tripService.getItinerary(this.tripId).subscribe({
        next: (data: ItineraryItem[]) => {
          this.itinerary = data;
          this.isViewOnly = false;
        },
        error: (err) => {
          if (err.status === 403 || err.status === 404) {
            // Try shared itinerary as fallback
            this.tripService.getSharedItinerary(this.tripId).subscribe({
              next: (sharedData: ItineraryItem[]) => {
                this.itinerary = sharedData;
                this.isViewOnly = true;
              },
              error: (sharedErr) => {
                console.error('Failed to load shared itinerary', sharedErr);
              }
            });
          } else {
            console.error('Failed to load itinerary', err);
          }
        }
      });
    }

  addItineraryItem(): void {
      if(this.isViewOnly) {
      console.warn('Cannot add items in view-only mode.');
      return;
    }

    if (this.formGroup.invalid) {
      console.warn('Form is invalid');
      return;
    }

    const { title, description, scheduledDateTime } = this.formGroup.value;

    const isoDate = new Date(scheduledDateTime).toISOString();
    if (isNaN(Date.parse(isoDate))) {
      console.error('Invalid datetime');
      return;
    }

    const itemToSend: ItineraryItemCreate = {
      title: title.trim(),
      description: description?.trim(),
      scheduledDateTime: isoDate
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
    this.formGroup.reset();
  }
}
