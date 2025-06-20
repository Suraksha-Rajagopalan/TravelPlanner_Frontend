// src/app/models/trip-with-ownership.model.ts

import { Trip } from './trip';

export interface TripWithOwnership extends Trip {
  isOwner: boolean;
  accessLevel?: 'View' | 'Edit';
}
