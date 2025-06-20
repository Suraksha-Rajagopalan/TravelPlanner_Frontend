import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../trip.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-share',
  templateUrl: './trip-share.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TripShareComponent implements OnInit {
  shareForm!: FormGroup;
  tripId!: number;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tripService: TripService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const tripIdParam = this.route.snapshot.paramMap.get('tripId');
    if (tripIdParam) {
      this.tripId = +tripIdParam;
    } else {
      alert('Trip ID not found.');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.shareForm = this.fb.group({
      tripId: [this.tripId],
      sharedWithEmail: ['', [Validators.required, Validators.email]],
      accessLevel: ['View', Validators.required]
    });
  }

  shareTrip(): void {
    if (this.shareForm.valid) {
      this.submitting = true;

      this.tripService.shareTrip(this.shareForm.value).subscribe({
        next: () => {
          alert('Trip shared successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          alert(err.error || 'Failed to share trip.');
          this.submitting = false;
        }
      });
    }
  }
}
