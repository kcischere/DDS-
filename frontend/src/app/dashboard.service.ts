import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    return this.http.get(`${this.apiUrl}/dashboard/stats`, { headers });
  }
}