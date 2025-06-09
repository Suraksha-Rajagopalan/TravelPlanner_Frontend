import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rate-trip',
  standalone: true,
  templateUrl: './rate-trip.component.html',
  styleUrls: ['./rate-trip.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class RateTripComponent {
  rating: number = 0;
  reviewText: string = '';

  constructor(private dialogRef: MatDialogRef<RateTripComponent>) {}

  selectRating(star: number): void {
    this.rating = star;
  }

  onSubmit(): void {
    this.dialogRef.close({ rating: this.rating, review: this.reviewText });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
