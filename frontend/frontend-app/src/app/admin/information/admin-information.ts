import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-admin-information',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, MatToolbarModule, MatButtonModule, MatInputModule,
    MatTableModule, MatFormFieldModule, MatCardModule, RouterModule],
  templateUrl: './admin-information.html',
  styleUrl: './admin-information.css',
})
export class AdminInformation implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);
  private api = environment.apiUrl;

  employees: any[] = [];
  editingEmployee: any = null;
  editForm: any = {};
  errorMsg = '';
  successMsg = '';

  private headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken() ?? ''}` }) };
  }

  ngOnInit() { this.load(); }

  load() {
    this.http.get<any[]>(`${this.api}/users/employees`, this.headers()).subscribe(data => {
      this.employees = data; this.cdr.detectChanges();
    });
  }

  startEdit(emp: any) {
    this.editingEmployee = emp;
    this.editForm = { name: emp.name, username: emp.username, role: emp.role, status: emp.status, email: emp.email || '', contact_number: emp.contact_number || '' };
    this.errorMsg = ''; this.successMsg = '';
  }

  cancelEdit() { this.editingEmployee = null; this.editForm = {}; }

  saveEdit() {
    if (!this.editForm.name || !this.editForm.username) { this.errorMsg = 'Name and username are required'; return; }
    this.http.put(`${this.api}/update-user/${this.editingEmployee.id}`, this.editForm, this.headers()).subscribe({
      next: () => { this.successMsg = 'Employee updated successfully'; this.editingEmployee = null; this.load(); },
      error: (e) => this.errorMsg = e.error?.message || 'Update failed'
    });
  }

  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
