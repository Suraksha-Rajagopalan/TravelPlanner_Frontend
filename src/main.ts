import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './app/auth/auth.interceptor';
import { withInterceptors } from '@angular/common/http';

// Components imports
import { LoginComponent } from './app/auth/login/login.component';
import { SignupComponent } from './app/auth/signup/signup.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { TripFormComponent } from './app/trip/trip-form/trip-form.component';
import { TripListComponent } from './app/trip/trip-list/trip-list.component';
import { TripManagerComponent } from './app/trip/trip-manager/trip-manager.component';
import { ProfileComponent } from './app/profile/profile.component';
import { TripDetailComponent } from './app/trip/trip-details/trip-details.component';
import { SampleTripsComponent } from './app/components/sample-trips/sample-trips.component';
import { TripEditComponent } from './app/trip/trip-edit/trip-edit.component';
import { authGuard } from './app/auth/auth.guard';
import { RateTripComponent } from './app/rating/rate-trip/rate-trip.component';
import { TripReviewsComponent } from './app/trip/trip-reviews/trip-reviews.component';
import { TripItineraryComponent } from './app/trip/trip-itinerary/trip-itinerary.component';
import { TripChecklistComponent } from './app/trip/trip-checklist/trip-checklist.component';
import { TripExpensesComponent } from './app/trip/trip-expenses/trip-expenses.component';
import { TripShareComponent } from './app/trip/trip-share/trip-share.component';

const routes: Routes = [
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
  { path: 'trip/:id/itinerary', component: TripItineraryComponent },
  { path: 'trip/:tripId/expenses', component: TripExpensesComponent },
  { path: 'trip/:tripId/checklist', component: TripChecklistComponent },
  { path: 'trip-share/:tripId', component: TripShareComponent },
  { path: 'trip-form', component: TripFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])
    )
  ],
});
