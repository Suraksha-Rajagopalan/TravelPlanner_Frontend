export interface ChecklistItem {
  id?: number;
  tripId: number;
  description: string;
  completed: boolean;
  userId?: number;
}