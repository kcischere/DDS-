import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  private noCache(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({ 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' })
    };
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`, this.noCache());
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard/users`, this.noCache());
  }

  updateUserStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/dashboard/users/${id}/status`, { status });
  }

  getLogs(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/logs`, this.noCache());
}

getLogsByAction(action: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/logs/filter?action=${action}`, this.noCache());
}

}