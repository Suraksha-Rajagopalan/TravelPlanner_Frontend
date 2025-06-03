import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Trip } from '../../models/trip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css'],
  imports: [FormsModule, CommonModule],
})
export class TripEditComponent {
  @Input() trip!: Trip;
  @Output() save = new EventEmitter<Trip>();
  @Output() cancel = new EventEmitter<void>();

  addEssential() {
    this.trip.essentials.push('');
  }

  removeEssential(index: number) {
    this.trip.essentials.splice(index, 1);
  }

  addTouristSpot() {
    this.trip.touristSpots.push('');
  }

  removeTouristSpot(index: number) {
    this.trip.touristSpots.splice(index, 1);
  }

  onSubmit() {
    this.save.emit(this.trip);
  }

  onCancel() {
    this.cancel.emit();
  }
}
