// trip-expenses.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../trip.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-expenses',
  templateUrl: './trip-expenses.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class TripExpensesComponent implements OnInit {
  tripId!: number;
  expenseForm!: FormGroup;
  expenses: any[] = [];
  summary: any[] = [];
  total: number = 0;
  editingExpense: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    const tripIdParam = this.route.snapshot.paramMap.get('tripId');
    if (!tripIdParam || isNaN(+tripIdParam)) {
      console.error('Invalid or missing tripId in route!');
      return;
    }

    this.tripId = +tripIdParam;
    this.initForm();
    this.loadExpenses();
  }

  initForm() {
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      description: [''],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
    });
  }

  loadExpenses() {
    this.tripService.getExpenses(this.tripId).subscribe(res => {
      this.expenses = res.expenses;
      this.summary = res.summary;
      this.total = res.total;
    });
  }
  
  resetForm() {
  this.expenseForm.reset({
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().substring(0, 10),
  });
  this.editingExpense = null;
}

  

addExpense() {
  if (this.expenseForm.invalid) return;

  const raw = this.expenseForm.value;

  const expense = {
    category: raw.category,
    description: raw.description,
    amount: raw.amount,
    date: new Date(raw.date).toISOString(),
  };

  if (this.editingExpense) {
    // Update existing expense
    this.tripService.updateExpense(this.tripId, this.editingExpense.id, expense).subscribe(() => {
      this.resetForm();
      this.loadExpenses();
    });
  } else {
    // Add new expense
    this.tripService.addExpense(this.tripId, expense).subscribe(() => {
      this.resetForm();
      this.loadExpenses();
    });
  }
}


  editExpense(expense: any) {
    this.expenseForm.patchValue({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      date: expense.date.substring(0, 10), // ISO to yyyy-MM-dd
    });
    this.editingExpense = expense;
  }


  deleteExpense(id: number) {
    this.tripService.deleteExpense(this.tripId, id).subscribe(() => {
      this.loadExpenses();
    });
  }
}
