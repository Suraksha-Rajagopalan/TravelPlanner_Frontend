export interface ChecklistItem {
  id?: number;
  tripId: number;
  description: string;
  isCompleted: boolean;
  userId?: number;
}