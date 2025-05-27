import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TripFormComponent } from '../app/trip/trip-form/trip-form.component';
import { TripListComponent } from './trip/trip-list/trip-list.component';
import { TripManagerComponent } from './trip/trip-manager/trip-manager.component';

export const routes: Routes = [
  { path: 'trip-form', component: TripFormComponent},
  {path: 'trip-list', component: TripListComponent},
  {path: 'trip-manager', component: TripManagerComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
