import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-dashboard',
  standalone: true,
imports: [CommonModule, DatePipe, FormsModule, MatCardModule, MatTableModule, MatSelectModule, MatFormFieldModule, RouterLink, MatButtonModule],  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  loading = true;
  displayedColumns = ['name', 'username', 'role', 'status', 'created_at'];

  allUsers: any[] = [];
  usersExpanded = false;
  statusOptions = ['active', 'inactive', 'deleted'];

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.loadStats();
      this.loadAllUsers();
    }, 100);
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  loadAllUsers() {
    this.dashboardService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Users error:', err)
    });
  }

  toggleUsers() {
    this.usersExpanded = !this.usersExpanded;
    this.cdr.detectChanges();
  }

  updateStatus(user: any, newStatus: string) {
    this.dashboardService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.status = newStatus;
        this.loadStats();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Status update error:', err)
    });
  }

  formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}