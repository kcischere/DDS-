import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatTableModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  loading = true;
  displayedColumns = ['name', 'username', 'role', 'status', 'created_at'];

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
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
    }, 100);
  }
}