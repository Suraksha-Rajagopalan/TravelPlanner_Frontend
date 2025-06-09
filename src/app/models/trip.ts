import { Itinerary } from "./itinerary";

export interface BudgetDetails {
  food: number;
  hotel: number;
}

export interface Review {
  tripId: number;
  userId: number;
  rating: number;
  reviewText: string; 
}

export interface Trip {
  id?: number;
  title: string;
  destination: string;
  startDate: string;        // ISO 8601 format (yyyy-MM-dd)
  endDate: string;
  budget: number;
  travelMode: string;
  notes: string;
  userId?: number;

  // Optional fields
  image?: string;
  description?: string;
  duration?: string;
  bestTime?: string;   
  essentials: string[];
  touristSpots: string[];
  budgetDetails: BudgetDetails;
  
  // Frontend-only UI helpers (not sent to backend)
  showItinerary?: boolean;
  itinerary?: any[]; // Replace with actual Itinerary type if defined
  rating?: number;
  review?:string;
}
