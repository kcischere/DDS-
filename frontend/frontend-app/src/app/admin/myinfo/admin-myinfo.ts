import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-admin-myinfo',
  standalone: true,
  imports: [FormsModule, NgIf, MatToolbarModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, RouterModule],
  templateUrl: './admin-myinfo.html',
  styleUrl: './admin-myinfo.css',
})
export class AdminMyInfo implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private api = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);

  profile: any = null;
  editForm: any = {};
  isEditing = false;
  isChangingPassword = false;
  oldPassword = ''; newPassword = ''; confirmPassword = '';
  errorMsg = ''; successMsg = '';
  pwErrorMsg = ''; pwSuccessMsg = '';

  private headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken() ?? ''}` }) };
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProfile();
    }
  }

  loadProfile() {
    this.http.get<any>(`${this.api}/profile`, this.headers()).subscribe({
      next: (data) => {
        this.profile = data;
        this.editForm = { name: data.name, username: data.username, email: data.email || '', contact_number: data.contact_number || '' };
      },
      error: (e) => {
        this.errorMsg = e.error?.message || 'Failed to load profile';
      }
    });
  }

  saveProfile() {
    this.errorMsg = ''; this.successMsg = '';
    this.http.put(`${this.api}/profile`, this.editForm, this.headers()).subscribe({
      next: () => { this.successMsg = 'Profile updated successfully'; this.isEditing = false; this.loadProfile(); },
      error: (e) => this.errorMsg = e.error?.message || 'Update failed'
    });
  }

  changePassword() {
    this.pwErrorMsg = ''; this.pwSuccessMsg = '';
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) { this.pwErrorMsg = 'All password fields are required'; return; }
    if (this.newPassword !== this.confirmPassword) { this.pwErrorMsg = 'New passwords do not match'; return; }
    if (this.newPassword.length < 6) { this.pwErrorMsg = 'New password must be at least 6 characters'; return; }
    this.http.put(`${this.api}/profile/password`, { oldPassword: this.oldPassword, newPassword: this.newPassword }, this.headers()).subscribe({
      next: () => { this.pwSuccessMsg = 'Password changed successfully'; this.oldPassword = ''; this.newPassword = ''; this.confirmPassword = ''; this.isChangingPassword = false; },
      error: (e) => this.pwErrorMsg = e.error?.message || 'Failed to change password'
    });
  }

  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
