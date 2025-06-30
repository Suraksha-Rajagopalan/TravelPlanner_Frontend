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
    console.log('ngOnInit triggered in TripExpensesComponent');

    const routeSnapshot = this.route.snapshot;
    console.log('ActivatedRoute.snapshot:', routeSnapshot);

    const paramMap = routeSnapshot.paramMap;
    console.log('routeSnapshot.paramMap:', paramMap);

    const tripIdParam = paramMap.get('tripId');
    console.log('Extracted tripId param:', tripIdParam);

    if (!tripIdParam || isNaN(+tripIdParam)) {
      console.error('Invalid or missing tripId in route! Value:', tripIdParam);
      return;
    }

    this.tripId = +tripIdParam;
    console.log('tripId parsed:', this.tripId);

    this.initForm();
    this.loadExpenses();
  }

  initForm() {
    console.log('Initializing form...');
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      description: [''],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
    });
  }

  loadExpenses() {
    console.log(`Loading expenses for tripId=${this.tripId}`);
    this.tripService.getExpenses(this.tripId).subscribe({
      next: (res) => {
        console.log('Expenses loaded:', res);
        this.expenses = res.expenses;
        this.summary = res.summary;
        this.total = res.total;
      },
      error: (err) => {
        console.error('Error loading expenses:', err);
      }
    });
  }

  resetForm() {
    console.log('Resetting form');
    this.expenseForm.reset({
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().substring(0, 10),
    });
    this.editingExpense = null;
  }

  addExpense() {
    if (this.expenseForm.invalid) {
      console.warn('Attempted to submit invalid form');
      return;
    }

    const raw = this.expenseForm.value;
    console.log('Expense form value:', raw);

    const expense = {
      category: raw.category,
      description: raw.description,
      amount: raw.amount,
      date: new Date(raw.date).toISOString(),
    };

    if (this.editingExpense) {
      console.log('Updating expense ID:', this.editingExpense.id);
      this.tripService.updateExpense(this.tripId, this.editingExpense.id, expense).subscribe(() => {
        this.resetForm();
        this.loadExpenses();
      });
    } else {
      console.log('Adding new expense...');
      this.tripService.addExpense(this.tripId, expense).subscribe(() => {
        this.resetForm();
        this.loadExpenses();
      });
    }
  }

  editExpense(expense: any) {
    console.log('Editing expense:', expense);
    this.expenseForm.patchValue({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      date: expense.date.substring(0, 10),
    });
    this.editingExpense = expense;
  }

  deleteExpense(id: number) {
    console.log('Deleting expense ID:', id);
    this.tripService.deleteExpense(this.tripId, id).subscribe(() => {
      this.loadExpenses();
    });
  }
}
