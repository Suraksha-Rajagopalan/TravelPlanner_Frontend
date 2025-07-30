// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Component imports
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TripFormComponent } from './trip/trip-form/trip-form.component';
import { TripListComponent } from './trip/trip-list/trip-list.component';
import { TripManagerComponent } from './trip/trip-manager/trip-manager.component';
import { ProfileComponent } from './profile/profile.component';
import { TripDetailComponent } from './trip/trip-details/trip-details.component';
import { SampleTripsComponent } from './components/sample-trips/sample-trips.component';
import { TripEditComponent } from './trip/trip-edit/trip-edit.component';
import { RateTripComponent } from './rating/rate-trip/rate-trip.component';
import { TripReviewsComponent } from './trip/trip-reviews/trip-reviews.component';
import { TripItineraryComponent } from './trip/trip-itinerary/trip-itinerary.component';
import { TripChecklistComponent } from './trip/trip-checklist/trip-checklist.component';
import { TripExpensesComponent } from './trip/trip-expenses/trip-expenses.component';
import { TripShareComponent } from './trip/trip-share/trip-share.component';
import { AdminComponent } from './admin.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'trip-list', component: TripListComponent },
  { path: 'trip-manager', component: TripManagerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'trip-details/:id', component: TripDetailComponent },
  { path: 'sample-trips/:id', component: SampleTripsComponent },
  { path: 'trip-edit/:id', component: TripEditComponent },
  { path: 'rate-trip', component: RateTripComponent },
  { path: 'trip-reviews', component: TripReviewsComponent },
  { path: 'trip/:tripId/itinerary', component: TripItineraryComponent },
  { path: 'trip/:tripId/expenses', component: TripExpensesComponent },
  { path: 'trip/:tripId/checklist', component: TripChecklistComponent },
  { path: 'trip-share/:tripId', component: TripShareComponent },
  { path: 'trip-form', component: TripFormComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
