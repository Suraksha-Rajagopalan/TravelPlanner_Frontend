import { Itinerary } from "./itinerary";

export interface Trip {
  showItinerary?: any;
  id?: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelMode: string;
  notes: string;
  itinerary: Itinerary[];
  userId: number;
}