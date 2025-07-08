import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../trip.service';
import { AuthService } from '../../auth/auth.service';
import { ChecklistItem } from '../../models/checklist';

@Component({
  standalone: true,
  selector: 'app-trip-checklist',
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-checklist.component.html',
})
export class TripChecklistComponent implements OnInit {
  private tripService = inject(TripService);
  private authService = inject(AuthService);

  tripId!: number;
  userId!: number;
  checklist: ChecklistItem[] = [];
  newItemText: string = '';
  editingItemId: number | null = null;
  editedText: string = '';

  isOwner: boolean = false;
  accessLevel: string = 'View';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    //console.log('TripChecklistComponent initialized');

    const idFromRoute = this.route.snapshot.paramMap.get('tripId');
    this.tripId = idFromRoute ? Number(idFromRoute) : NaN;
    //console.log('Converted tripId:', this.tripId);

    if (!this.tripId || isNaN(this.tripId)) {
      console.error('Invalid trip ID:', this.tripId);
      return;
    }

    this.userId = this.authService.getUserId();
    //console.log('Current userId:', this.userId);

    // Get accessLevel from navigation state
    this.route.queryParams.subscribe(params => {
      this.accessLevel = params['accessLevel'] ?? 'View';
      //console.log('Access Level from queryParams:', this.accessLevel);
    });

    this.loadTripAndChecklist();
  }

  get isReadOnly(): boolean {
    return !(this.isOwner || this.accessLevel === 'Edit');
  }

  loadTripAndChecklist() {
    this.tripService.getTripByIdFromBackend(this.tripId).subscribe(trip => {
      this.isOwner = trip.userId === this.userId;

      if (this.isOwner || this.accessLevel === 'Edit') {
        this.tripService.getChecklist(this.tripId).subscribe(items => {
          this.checklist = items;
        });
      } else {
        // Shared read-only access
        this.tripService.getSharedTripChecklist(this.tripId).subscribe(items => {
          this.checklist = items;
        });
      }
    });
  }


  addItem() {
    if (this.isReadOnly || !this.newItemText.trim()) return;

    const newItem: ChecklistItem = {
      tripId: this.tripId,
      userId: this.userId,
      description: this.newItemText,
      isCompleted: false,
    };

    this.tripService.addChecklistItem(newItem).subscribe(added => {
      this.checklist.push(added);
      this.newItemText = '';
    });
  }

  toggleComplete(item: ChecklistItem) {
    if (this.isReadOnly) return;

    item.isCompleted = !item.isCompleted;
    this.tripService.updateChecklistItem(item).subscribe();
  }

  deleteItem(item: ChecklistItem) {
    if (this.isReadOnly) return;

    this.tripService.deleteChecklistItem(this.tripId, item.id!).subscribe(() => {
      this.checklist = this.checklist.filter(i => i.id !== item.id);
    });
  }

  startEdit(item: ChecklistItem) {
    if (this.isReadOnly) return;

    this.editingItemId = item.id!;
    this.editedText = item.description;
  }

  saveEdit(item: ChecklistItem) {
    if (!this.editedText.trim()) return;

    item.description = this.editedText;
    this.tripService.updateChecklistItem(item).subscribe(() => {
      this.editingItemId = null;
    });
  }

  cancelEdit() {
    this.editingItemId = null;
  }
}
