import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private tripService = inject(TripService);
  private authService = inject(AuthService);

  tripId!: number;
  userId!: number;
  checklist: ChecklistItem[] = [];
  newItemText: string = '';

  ngOnInit() {
    this.tripId = +this.route.snapshot.paramMap.get('id')!;
    this.userId = this.authService.getUserId(); 
    this.loadChecklist();
  }

  loadChecklist() {
    this.tripService.getChecklist(this.tripId).subscribe(items => {
      this.checklist = items;
    });
  }

  addItem() {
    if (!this.newItemText.trim()) return;

    const newItem: ChecklistItem = {
      tripId: this.tripId,
      userId: this.userId,
      description: this.newItemText,
      completed: false,
    };

    this.tripService.addChecklistItem(newItem).subscribe(added => {
      this.checklist.push(added);
      this.newItemText = '';
    });
  }

  toggleComplete(item: ChecklistItem) {
    item.completed = !item.completed;
    this.tripService.updateChecklistItem(item).subscribe();
  }

  deleteItem(item: ChecklistItem) {
  this.tripService.deleteChecklistItem(this.tripId, item.id!).subscribe(() => {
    this.checklist = this.checklist.filter(i => i.id !== item.id);
  });
}
}
