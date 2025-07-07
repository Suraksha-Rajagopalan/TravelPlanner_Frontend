import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  lastLoginDate: string | null;
  numberOfTrips: number;
  isActive: boolean;
  tripTitles: string[];
  role: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule]
})
export class AdminComponent implements OnInit {
  users: AdminUser[] = [];
  selectedUser: AdminUser | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<AdminUser[]>('https://localhost:7251/api/admin/users')
      .subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (error) => {
          console.error('Error fetching admin users:', error);
        }
      });
  }

  viewDetails(user: AdminUser): void {
    this.selectedUser = user;
  }

  closeDetails(): void {
    this.selectedUser = null;
  }

  deleteUser(userId: number) {
    return this.http.delete(`https://localhost:7251/api/admin/delete-user/${userId}`);
  }


  removeUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
        },
        error: err => {
          console.error('Failed to delete user', err);
          alert('Failed to delete user.');
        }
      });
    }
  }

}
