import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, MatCardModule, MatTableModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './logs.html',
  styleUrl: './logs.css'
})
export class Logs implements OnInit {
  logs: any[] = [];
  filteredLogs: any[] = [];
  loading = true;
  selectedAction = '';

  actionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGIN_FAILED', label: 'Failed Login' },
    { value: 'REGISTER', label: 'Register' },
    { value: 'ADD_USER', label: 'Add User' },
    { value: 'UPDATE_USER', label: 'Update User' },
    { value: 'DISABLE_USER', label: 'Disable User' },
    { value: 'ENABLE_USER', label: 'Enable User' },
    { value: 'DELETE_USER', label: 'Delete User' },
    { value: 'UPLOAD_DOCUMENT', label: 'Upload Document' },
    { value: 'DOWNLOAD_DOCUMENT', label: 'Download Document' },
    { value: 'DELETE_DOCUMENT', label: 'Delete Document' },
  ];

  displayedColumns = ['created_at', 'username', 'action', 'details', 'ip_address'];

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.dashboardService.getLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.filteredLogs = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Logs error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterLogs() {
    if (!this.selectedAction) {
      this.filteredLogs = this.logs;
    } else {
      this.filteredLogs = this.logs.filter(l => l.action === this.selectedAction);
    }
    this.cdr.detectChanges();
  }
}