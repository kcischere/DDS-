import { Injectable, inject, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID); 
  private apiUrl = 'http://localhost:4000'; 

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string; role: string; name: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId) && response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_role', response.role); 
          localStorage.setItem('user_name', response.name); 
        }
      })
    );
  }

  register(user: { username: string; password: string; name: string }) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, user);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('auth_token');
    }
    return null; 
  }

  getUserRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('user_role');
    }
    return null;
  }

  getUserName(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('user_name');
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
    }
  }
}