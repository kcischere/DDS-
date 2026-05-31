import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth.service'; 

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token ? token : ''}`
      })
    };
  }

  getUsers() {
    return this.http.get<any[]>(`${this.api}/users`, this.getAuthHeaders());
  }

  // Updated to include role
  addUser(name: string, username: string, password: string, role: string) {
    return this.http.post(`${this.api}/add-user`, { name, username, password, role }, this.getAuthHeaders());
  }

  // Updated to include role
  updateUser(id: number, name: string, username: string, role: string) {
    return this.http.put(`${this.api}/update-user/${id}`, { name, username, role }, this.getAuthHeaders());
  }

  disableUser(id: number) {
    return this.http.patch(`${this.api}/disable-user/${id}`, {}, this.getAuthHeaders());
  }

  enableUser(id: number) {
    return this.http.patch(`${this.api}/enable-user/${id}`, {}, this.getAuthHeaders());
  }

  softDeleteUser(id: number) {
    return this.http.patch(`${this.api}/soft-delete-user/${id}`, {}, this.getAuthHeaders());
  }
}