// This is for retrieving items from the backend
export interface ItineraryItem {
  id: number;
  tripId: number;
  title: string;
  description?: string;
  scheduledDateTime: string; // ISO 8601
}

// This is for creating a new item (without `id`)
export interface ItineraryItemCreate {
  title: string;
  description?: string;
  scheduledDateTime: string; // ISO 8601
}
