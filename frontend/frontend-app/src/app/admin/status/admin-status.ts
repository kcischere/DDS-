import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DashboardService } from './admin-status.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-status',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './admin-status.html',
  styleUrl: './admin-status.css',
})
export class AdminStatus implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  stats: any = null;
  loading = true;
  displayedColumns = ['id', 'name', 'username', 'role', 'status'];

  ngOnInit() {
    setTimeout(() => {
      this.dashboardService.getStats().subscribe({
        next: (data) => { this.stats = data; this.loading = false; this.cdr.detectChanges(); },
        error: () => { this.loading = false; this.cdr.detectChanges(); }
      });
    }, 100);
  }

  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
