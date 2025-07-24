import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Trip } from '../models/trip';
import { Review } from '../models/trip';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ItineraryItemCreate, ItineraryItem } from '../models/itinerary';
import { ChecklistItem } from '../models/checklist';


@Injectable({
  providedIn: 'root'
})
export class TripService {
  private baseUrl = 'http://localhost:5276/api';

  sampleTrips: Trip[] = [
    {
      id: 101,
      title: 'Beach Getaway',
      destination: 'Goa, India',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      itinerary: [],
      userId: 0,
      image: 'trips/beach.jpg',
      description: 'Relax on sunny beaches and enjoy seafood.',
      duration: '7 Days',
      bestTime: 'October to March',
      essentials: ['Sunscreen', 'Swimwear', 'Sunglasses', 'Flip-flops'],
      touristSpots: ['Baga Beach', 'Fort Aguada', 'Dudhsagar Falls'],
      budgetDetails: {
        food: 3000,
        hotel: 6000
      }
    },
    {
      id: 102,
      title: 'Mountain Adventure',
      destination: 'Manali, India',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      itinerary: [],
      userId: 0,
      image: 'trips/mountain.jpg',
      description: 'Explore snow-covered mountains and trekking routes.',
      duration: '5 Days',
      bestTime: 'December to February',
      essentials: ['Warm Clothes', 'Trekking Shoes', 'Backpack'],
      touristSpots: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple'],
      budgetDetails: {
        food: 2500,
        hotel: 4500
      }
    },
    {
      id: 103,
      title: 'Cultural Expedition',
      destination: 'Jaipur, India',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      itinerary: [],
      userId: 0,
      image: 'trips/culture.jpg',
      description: 'Dive into Rajasthani culture, food, and architecture.',
      duration: '4 Days',
      bestTime: 'November to February',
      essentials: ['Camera', 'Ethnic Wear', 'Sunscreen'],
      touristSpots: ['Amber Fort', 'City Palace', 'Hawa Mahal'],
      budgetDetails: {
        food: 2000,
        hotel: 3500
      }
    },
    {
      id: 104,
      title: 'Backwater Escape',
      destination: 'Alleppey, Kerala',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      itinerary: [],
      userId: 0,
      image: 'trips/backwater.jpg',
      description: 'Stay in a houseboat and explore Kerala’s backwaters.',
      duration: '3 Days',
      bestTime: 'September to March',
      essentials: ['Mosquito Repellent', 'Camera', 'Cotton Clothes'],
      touristSpots: ['Vembanad Lake', 'Alleppey Beach', 'Krishnapuram Palace'],
      budgetDetails: {
        food: 2200,
        hotel: 4000
      }
    },
    {
      id: 105,
      title: 'Desert Safari',
      destination: 'Jaisalmer, Rajasthan',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      itinerary: [],
      userId: 0,
      image: 'trips/desert.jpg',
      description: 'Enjoy camel rides, folk music, and camping in the desert.',
      duration: '2 Days',
      bestTime: 'October to March',
      essentials: ['Hat', 'Scarf', 'Water Bottle'],
      touristSpots: ['Sam Sand Dunes', 'Jaisalmer Fort', 'Patwon Ki Haveli'],
      budgetDetails: {
        food: 1800,
        hotel: 3000
      }
    }
  ];
  private myTrips: Trip[] = [];

  constructor(private http: HttpClient) { }

  // Backend API Methods
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/Trip`);
  }

  getTripByIdFromBackend(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/Trip/${id}`);
  }

  addTrip(trip: Trip) {
    return this.http.post<Trip>(`${this.baseUrl}/Trip`, trip);
  }


  updateTrip(trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/Trip/${trip.id}`, trip);
  }


  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Trip/${id}`);
  }

  updateSharedTrip(trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/Trip/shared/${trip.id}`, trip);
  }


  // Local Sample & MyTrips Methods
  getSampleTrips(): Trip[] {
    return this.sampleTrips;
  }

  getSampleTripById(id: number): Trip | undefined {
    return this.sampleTrips.find((t: Trip) => t.id === id);
  }

  getMyTrips(): Trip[] {
    return this.myTrips;
  }

  addToMyTrips(trip: Trip): void {
    const exists = this.myTrips.find((t: Trip) => t.id === trip.id);
    if (!exists) {
      this.myTrips.push(trip);
      console.log('Trip added:', trip);
    }
  }

  // Functions for Reviews-

  getReview(tripId: number): Observable<Review | null> {
    return this.http.get<Review[]>(`${this.baseUrl}/Trip/${tripId}/reviews`).pipe(
      map(reviews => reviews.length > 0 ? reviews[0] : null),
      catchError(() => of(null))
    );
  }

  // Ratings-
  submitRatingAndReview(tripId: number, rating: number, review: string) {
    return this.http.post(`${this.baseUrl}/Trip/${tripId}/review`, { rating, review });
  }


  // For all reviwes and Ratings
  searchTripReviews(destination: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/TripReviews/search`, {
      params: { destination }
    });
  }

  //Itinerarys-
  getItinerary(tripId: number): Observable<ItineraryItem[]> {
    return this.http.get<ItineraryItem[]>(`${this.baseUrl}/trips/${tripId}/itinerary`);
  }

  addItineraryItem(tripId: number, item: ItineraryItemCreate): Observable<ItineraryItem> {
    console.log('Sending:', item);  // what is sent to the backend
    return this.http.post<ItineraryItem>(
      `${this.baseUrl}/trips/${tripId}/itinerary`,
      item
    );
  }

  getSharedItinerary(tripId: number): Observable<ItineraryItem[]> {
    return this.http.get<ItineraryItem[]>(`${this.baseUrl}/shared/trips/${tripId}/itinerary`);
  }



  updateItineraryItem(tripId: number, item: ItineraryItem): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/trips/${tripId}/itinerary/${item.id}`, item);
  }

  deleteItineraryItem(tripId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/trips/${tripId}/itinerary/${id}`);
  }

  // src/app/trip/trip.service.ts
  getChecklist(tripId: number) {
    return this.http.get<ChecklistItem[]>(`${this.baseUrl}/trips/${tripId}/checklists`);
  }

  addChecklistItem(item: ChecklistItem) {
    return this.http.post<ChecklistItem>(`${this.baseUrl}/trips/${item.tripId}/checklists`, item);
  }

  updateChecklistItem(item: ChecklistItem) {
    return this.http.put(`${this.baseUrl}/trips/${item.tripId}/checklists/${item.id}`, item);
  }

  deleteChecklistItem(tripId: number, id: number) {
    return this.http.delete(`${this.baseUrl}/trips/${tripId}/checklists/${id}`);
  }

  getSharedTripChecklist(tripId: number): Observable<ChecklistItem[]> {
    return this.http.get<ChecklistItem[]>(`${this.baseUrl}/shared-trips/${tripId}/checklists`);
  }



  // Budget Tracking

  // src/app/trip/trip.service.ts

  getExpenses(tripId: number) {
    return this.http.get<any>(`${this.baseUrl}/trips/${tripId}/expenses`);
  }

  addExpense(tripId: number, expense: any) {
    return this.http.post(`${this.baseUrl}/trips/${tripId}/expenses`, expense);
  }

  deleteExpense(tripId: number, id: number) {
    return this.http.delete(`${this.baseUrl}/trips/${tripId}/expenses/${id}`);
  }

  updateExpense(tripId: number, expenseId: number, expense: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/trips/${tripId}/expenses/${expenseId}`, expense);
  }

  getSharedExpenses(tripId: number) {
    return this.http.get<any>(`${this.baseUrl}/trips/${tripId}/shared-expenses`);
  }


  // Shared trips

  shareTrip(data: {
    tripId: number;
    sharedWithEmail: string;
    accessLevel: 'view' | 'edit';
  }) {
    return this.http.post(`${this.baseUrl}/TripShare/share`, data);
  }

  getSharedTrips() {
    return this.http.get<Trip[]>(`${this.baseUrl}/TripShare/shared-with-me`);
  }


}