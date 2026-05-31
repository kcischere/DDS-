import { Component, OnInit, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule, Router } from '@angular/router';
import { DocumentService } from './user-documents.service';
import { AuthService } from '../../auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-documents',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterModule,
    MatToolbarModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './user-documents.html',
  styleUrl: './user-documents.css',
})
export class UserDocuments implements OnInit {
  private docService = inject(DocumentService);
  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  folders: any[] = [];
  allFolders: any[] = [];
  documents: any[] = [];
  filteredDocuments: any[] = [];
  currentFolder: any = null;
  breadcrumb: any[] = [];

  labels: any[] = [];
  filterLabel: string = '';
  searchQuery: string = '';
  sortBy: 'label' | 'date' = 'date';
  sortDir: 'asc' | 'desc' = 'desc';

  viewerOpen = false;
  viewerUrl: SafeResourceUrl | null = null;
  viewerDoc: any = null;

  ngOnInit() { this.loadLabels(); this.load(); }

  loadLabels() { this.docService.getLabels().subscribe(data => this.labels = data); }

  load() {
    const folderId = this.currentFolder?.id ?? null;
    this.docService.getFolders().subscribe(all => {
      this.allFolders = all;
      this.folders = all.filter(f => (f.parent_id ?? null) === folderId);
    });
    this.docService.getDocuments(folderId).subscribe(docs => {
      this.documents = docs;
      this.applySort();
    });
  }

  applySort() {
    let docs = [...this.documents];
    if (this.filterLabel) docs = docs.filter(d => d.label === this.filterLabel);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      docs = docs.filter(d => d.original_name.toLowerCase().includes(q));
    }
    docs.sort((a, b) => {
      let valA: any, valB: any;
      if (this.sortBy === 'label') { valA = a.label ?? ''; valB = b.label ?? ''; }
      else { valA = new Date(a.uploaded_at).getTime(); valB = new Date(b.uploaded_at).getTime(); }
      if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    this.filteredDocuments = docs;
  }

  setSort(field: 'label' | 'date') {
    if (this.sortBy === field) { this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'; }
    else { this.sortBy = field; this.sortDir = 'desc'; }
    this.applySort();
  }

  openFolder(folder: any) { this.breadcrumb.push(this.currentFolder); this.currentFolder = folder; this.load(); }
  goHome() { this.breadcrumb = []; this.currentFolder = null; this.load(); }

  viewDocument(doc: any) {
    const token = this.authService.getToken();
    const url = `${this.docService.getViewUrl(doc.id)}?token=${token}`;
    this.viewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.viewerDoc = doc; this.viewerOpen = true;
  }
  closeViewer() { this.viewerOpen = false; this.viewerUrl = null; this.viewerDoc = null; }

  downloadDocument(doc: any) {
    this.docService.downloadDocument(doc.id, doc.original_name).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = doc.original_name; a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
