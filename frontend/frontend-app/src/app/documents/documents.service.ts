import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private api = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` }) };
  }

  getFolders() {
    return this.http.get<any[]>(`${this.api}/folders`, this.getAuthHeaders());
  }

  createFolder(name: string, parent_id?: number | null) {
    return this.http.post(`${this.api}/folders`, { name, parent_id }, this.getAuthHeaders());
  }

  renameFolder(id: number, name: string) {
    return this.http.put(`${this.api}/folders/${id}`, { name }, this.getAuthHeaders());
  }

  deleteFolder(id: number) {
    return this.http.delete(`${this.api}/folders/${id}`, this.getAuthHeaders());
  }

  getDocuments(folderId?: number | null) {
    const param = folderId == null ? 'null' : folderId;
    return this.http.get<any[]>(`${this.api}/documents?folder_id=${param}`, this.getAuthHeaders());
  }

  uploadDocument(file: File, folderId?: number | null) {
    const token = this.authService.getToken();
    const formData = new FormData();
    formData.append('file', file);
    if (folderId != null) formData.append('folder_id', String(folderId));
    return this.http.post<any>(`${this.api}/documents/upload`, formData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` }),
    });
  }

  renameDocument(id: number, original_name: string, folder_id?: number | null) {
    return this.http.put(`${this.api}/documents/${id}`, { original_name, folder_id }, this.getAuthHeaders());
  }

  deleteDocument(id: number) {
    return this.http.delete(`${this.api}/documents/${id}`, this.getAuthHeaders());
  }

  getViewUrl(id: number) {
    return `${this.api}/documents/${id}/view`;
  }

  getDownloadUrl(id: number) {
    return `${this.api}/documents/${id}/download`;
  }

  downloadDocument(id: number, filename: string) {
    const token = this.authService.getToken();
    return this.http.get(`${this.api}/documents/${id}/download`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` }),
      responseType: 'blob',
    });
  }

  // Labels
  getLabels() {
    return this.http.get<any[]>(`${this.api}/labels`, this.getAuthHeaders());
  }

  createLabel(name: string) {
    return this.http.post<any>(`${this.api}/labels`, { name }, this.getAuthHeaders());
  }

  renameLabel(id: number, name: string) {
    return this.http.put(`${this.api}/labels/${id}`, { name }, this.getAuthHeaders());
  }

  deleteLabel(id: number) {
    return this.http.delete(`${this.api}/labels/${id}`, this.getAuthHeaders());
  }

  // Update document (label, rename, move folder — all in one)
  updateDocument(id: number, original_name: string, folder_id: number | null, label: string | null) {
    return this.http.put(`${this.api}/documents/${id}`, { original_name, folder_id, label }, this.getAuthHeaders());
  }
}
