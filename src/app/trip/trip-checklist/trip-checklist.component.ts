import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../trip.service';
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
  tripId!: number;
  checklist: ChecklistItem[] = [];
  newItemText: string = '';

  ngOnInit() {
    this.tripId = +this.route.snapshot.paramMap.get('id')!;
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
      text: this.newItemText,
      isCompleted: false,
    };

    this.tripService.addChecklistItem(newItem).subscribe(added => {
      this.checklist.push(added);
      this.newItemText = '';
    });
  }

  toggleComplete(item: ChecklistItem) {
    item.isCompleted = !item.isCompleted;
    this.tripService.updateChecklistItem(item).subscribe();
  }

  deleteItem(item: ChecklistItem) {
    this.tripService.deleteChecklistItem(item.id!).subscribe(() => {
      this.checklist = this.checklist.filter(i => i.id !== item.id);
    });
  }
}
