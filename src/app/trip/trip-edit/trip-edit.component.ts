import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Trip } from '../../models/trip';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class TripEditComponent implements OnInit {
  @Input() trip!: Trip;
  @Output() save = new EventEmitter<Trip>();
  @Output() cancel = new EventEmitter<void>();
  tripForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTripByIdFromBackend(id).subscribe((tripData) => {
      this.trip = tripData;
      this.initializeForm();
    });
  }

  private formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  }

  initializeForm(): void {
    this.tripForm = this.fb.group({
      title: [this.trip.title],
      destination: [this.trip.destination],
      startDate: [this.formatDate(this.trip.startDate)],
      endDate: [this.formatDate(this.trip.endDate)],
      budget: [this.trip.budget],
      travelMode: [this.trip.travelMode],
      notes: [this.trip.notes],
      duration: [this.trip.duration],
      bestTime: [this.trip.bestTime],
      image: [this.trip.image],
      description: [this.trip.description],
      userId: [this.trip.userId],
      essentials: [this.trip.essentials],
      touristSpots: [this.trip.touristSpots],
      budgetDetails: this.fb.group({
        food: [this.trip.budgetDetails?.food || 0],
        hotel: [this.trip.budgetDetails?.hotel || 0],
      }),
    });
  }

  addEssential() {
    const essentials = [...this.tripForm.get('essentials')?.value || []];
    essentials.push('');
    this.tripForm.patchValue({ essentials });
  }

  removeEssential(index: number) {
    const essentials = [...this.tripForm.get('essentials')?.value || []];
    essentials.splice(index, 1);
    this.tripForm.patchValue({ essentials });
  }

  onEssentialChange(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const essentials = [...this.tripForm.get('essentials')?.value || []];
    essentials[index] = target.value;
    this.tripForm.patchValue({ essentials });
  }

  addTouristSpot() {
    const spots = [...this.tripForm.get('touristSpots')?.value || []];
    spots.push('');
    this.tripForm.patchValue({ touristSpots: spots });
  }

  removeTouristSpot(index: number) {
    const spots = [...this.tripForm.get('touristSpots')?.value || []];
    spots.splice(index, 1);
    this.tripForm.patchValue({ touristSpots: spots });
  }

  onTouristSpotChange(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const spots = [...this.tripForm.get('touristSpots')?.value || []];
    spots[index] = target.value;
    this.tripForm.patchValue({ touristSpots: spots });
  }

  onSubmit() {
    const updatedTrip: Trip = this.tripForm.value;
    updatedTrip.id = this.trip.id;
    updatedTrip.userId = this.trip.userId;

    this.tripService.updateTrip(updatedTrip).subscribe({
      next: (response) => {
        console.log('Trip updated successfully:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error updating trip:', error);
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
