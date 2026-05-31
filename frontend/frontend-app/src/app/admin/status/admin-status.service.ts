import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getStats(): Observable<any> {
    const token = this.authService.getToken();
    return this.http.get(`${this.api}/dashboard/stats`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` })
    });
  }
}
