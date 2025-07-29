import { Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Trip } from '../models/trip';
import { Review } from '../models/trip';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ItineraryItemCreate, ItineraryItem } from '../models/itinerary';
import { ChecklistItem } from '../models/checklist';
import { AuthService } from '../auth/auth.service';


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

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Backend API Methods
  getTrips(): Observable<Trip[]> {
    return this.http.get<any>(`${this.baseUrl}/Trip`).pipe(
      map(response => response.result)
    );
  }


  getTripByIdFromBackend(id: number): Observable<Trip> {
    return this.http.get<any>(`${this.baseUrl}/Trip/${id}`).pipe(
      map(response => response.result) // unwrap AutoWrapper
    );
  }


  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<any>(`${this.baseUrl}/Trip`, trip).pipe(
      map(response => response.result)
    );
  }

  updateTrip(trip: Trip): Observable<Trip> {
    return this.http.put<{ result: Trip }>(`${this.baseUrl}/Trip/${trip.id}`, trip).pipe(
      map(response => response.result)
    );
  }

  deleteTrip(id: number): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/Trip/${id}`).pipe(
      map(response => {
        if (response.isSuccess) {
          return; // return void
        } else {
          throw new Error('Failed to delete trip');
        }
      })
    );
  }


  updateSharedTrip(trip: Trip): Observable<Trip[]> {
    return this.http.put<any>(`${this.baseUrl}/Trip/shared/${trip.id}`, trip).pipe(
      map(response => response.result)
    );
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
    return this.http.get<any>(`${this.baseUrl}/Reviews/${tripId}`).pipe(
      map(response => {
        const reviews: Review[] = response.result;
        return reviews.length > 0 ? reviews[0] : null;
      }),
      catchError(() => of(null))
    );
  }


  // Ratings-
  submitRatingAndReview(tripId: number, rating: number, review: string): Observable<any> {
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('User ID is missing.');
      return of(null); // fallback in case user not found
    }

    const payload = { tripId, userId, rating, review };

    return this.http.post<any>(`${this.baseUrl}/Reviews`, payload).pipe(
      map(response => response.result),
      catchError(error => {
        console.error('Failed to submit review:', error);
        return of(null);
      })
    );
  }



  searchTripReviews(destination: string): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/TripReviews/search`, {
      params: { destination }
    }).pipe(
      map(response => response.result)
    );
  }

  // Itinerary
  getItinerary(tripId: number): Observable<ItineraryItem[]> {
    return this.http.get<any>(`${this.baseUrl}/trips/${tripId}/itinerary`).pipe(
      map(response => response.result)
    );
  }

  addItineraryItem(tripId: number, item: ItineraryItemCreate): Observable<ItineraryItem> {
    return this.http.post<any>(`${this.baseUrl}/trips/${tripId}/itinerary`, item).pipe(
      map(response => response.result)
    );
  }

  getSharedItinerary(tripId: number): Observable<ItineraryItem[]> {
    return this.http.get<any>(`${this.baseUrl}/shared/trips/${tripId}/itinerary`).pipe(
      map(response => response.result)
    );
  }

  updateItineraryItem(tripId: number, item: ItineraryItem): Observable<void> {
    return this.http.put<any>(`${this.baseUrl}/trips/${tripId}/itinerary/${item.id}`, item).pipe(
      map(() => void 0)
    );
  }

  deleteItineraryItem(tripId: number, id: number): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/trips/${tripId}/itinerary/${id}`).pipe(
      map(() => void 0)
    );
  }

  // Checklist
  getChecklist(tripId: number): Observable<ChecklistItem[]> {
    return this.http.get<any>(`${this.baseUrl}/trips/${tripId}/checklists`).pipe(
      map(response => response.result)
    );
  }

  addChecklistItem(item: ChecklistItem): Observable<ChecklistItem> {
    return this.http.post<any>(`${this.baseUrl}/trips/${item.tripId}/checklists`, item).pipe(
      map(response => response.result)
    );
  }

  updateChecklistItem(item: ChecklistItem): Observable<void> {
    return this.http.put<any>(`${this.baseUrl}/trips/${item.tripId}/checklists/${item.id}`, item).pipe(
      map(() => void 0)
    );
  }

  deleteChecklistItem(tripId: number, id: number): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/trips/${tripId}/checklists/${id}`).pipe(
      map(() => void 0)
    );
  }

  getSharedTripChecklist(tripId: number): Observable<ChecklistItem[]> {
    return this.http.get<any>(`${this.baseUrl}/shared-trips/${tripId}/checklists`).pipe(
      map(response => response.result)
    );
  }

  // Budget Tracking
  getExpenses(tripId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/trips/${tripId}/expenses`).pipe(
      map(response => response.result)
    );
  }


  addExpense(tripId: number, expense: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/trips/${tripId}/expenses`, expense).pipe(
      map(response => response.result)
    );
  }

  deleteExpense(tripId: number, id: number): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/trips/${tripId}/expenses/${id}`).pipe(
      map(() => void 0)
    );
  }

  updateExpense(tripId: number, expenseId: number, expense: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/trips/${tripId}/expenses/${expenseId}`, expense).pipe(
      map(response => response.result)
    );
  }

  getSharedExpenses(tripId: number): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/trips/${tripId}/shared-expenses`).pipe(
      map(response => response.result)
    );
  }

  // Shared Trips
  shareTrip(data: {
    tripId: number;
    sharedWithEmail: string;
    accessLevel: 'view' | 'edit';
  }): Observable<string> {
    return this.http.post<any>(`${this.baseUrl}/TripShare/share`, data).pipe(
      map(response => response.message)
    );
  }

  getSharedTrips(): Observable<Trip[]> {
    return this.http.get<any>(`${this.baseUrl}/TripShare/shared-with-me`).pipe(
      map(response => response.result)
    );
  }
}