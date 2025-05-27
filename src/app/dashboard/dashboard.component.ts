import { Trip } from './../models/trip';
import { TripManagerComponent } from './../trip/trip-manager/trip-manager.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TripService } from '../trip/trip.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
trips: Trip[] = [];

selectedTrip: Trip | null = null;

editTrip(trip: Trip) {
  // Cloning the trip to avoid editing directly
  this.selectedTrip = { ...trip };
}

constructor(private tripService: TripService) {}

ngOnInit(): void{
  this.tripService.getTrips().subscribe((trips: Trip[]) => {
    this.trips = trips;
  });
}
}
