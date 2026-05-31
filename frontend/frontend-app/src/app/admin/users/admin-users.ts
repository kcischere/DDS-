import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, MatToolbarModule, MatButtonModule, MatInputModule,
    MatTableModule, MatFormFieldModule, MatCardModule, MatSelectModule, RouterModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);
  private api = environment.apiUrl;

  users: any[] = [];
  name = ''; username = ''; password = ''; role = 'User';
  errorMsg = '';

  private headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken() ?? ''}` }) };
  }

  ngOnInit() { this.getUsers(); }

  getUsers() {
    this.http.get<any[]>(`${this.api}/users`, this.headers()).subscribe(data => {
      this.users = data; this.cdr.detectChanges();
    });
  }

  addUser() {
    if (!this.name || !this.username || !this.password) { this.errorMsg = 'All fields are required'; return; }
    this.errorMsg = '';
    this.http.post(`${this.api}/add-user`, { name: this.name, username: this.username, password: this.password, role: this.role }, this.headers())
      .subscribe({ next: () => { this.name = ''; this.username = ''; this.password = ''; this.role = 'User'; this.getUsers(); },
        error: (e) => this.errorMsg = e.error?.message || 'Failed to add user' });
  }

  editUser(user: any) {
    const newName = prompt('Enter new name:', user.name);
    const newUsername = prompt('Enter new username:', user.username);
    const newRole = prompt('Enter role (Admin/User):', user.role);
    if (newName && newUsername && newRole) {
      this.http.put(`${this.api}/update-user/${user.id}`, { name: newName, username: newUsername, role: newRole }, this.headers())
        .subscribe(() => this.getUsers());
    }
  }

  disableUser(id: number) { this.http.patch(`${this.api}/disable-user/${id}`, {}, this.headers()).subscribe(() => this.getUsers()); }
  enableUser(id: number) { this.http.patch(`${this.api}/enable-user/${id}`, {}, this.headers()).subscribe(() => this.getUsers()); }
  softDeleteUser(id: number) { this.http.patch(`${this.api}/soft-delete-user/${id}`, {}, this.headers()).subscribe(() => this.getUsers()); }

  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
