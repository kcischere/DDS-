import { Component, OnInit, inject } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule, Router } from '@angular/router';
import { DocumentService } from './admin-documents.service';
import { AuthService } from '../../auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-documents',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe, RouterModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatTooltipModule],
  templateUrl: './admin-documents.html',
  styleUrl: './admin-documents.css',
})
export class AdminDocuments implements OnInit {
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
  showLabelManager = false;
  newLabelName = '';
  renamingLabel: any = null;
  renameLabelValue = '';

  selectedFile: File | null = null;
  uploadFolderId: number | null = null;
  uploadLabel: string | null = null;

  showNewFolderInput = false;
  newFolderName = '';

  renamingFolder: any = null;
  renamingDocument: any = null;
  renameValue = '';

  movingDocument: any = null;
  moveTargetFolderId: number | null = null;

  viewerOpen = false;
  viewerUrl: SafeResourceUrl | null = null;
  viewerDoc: any = null;

  infoDoc: any = null;
  editingLabelDoc: any = null;
  editLabelValue: string | null = null;

  sortBy: 'label' | 'type' | 'size' | 'date' = 'date';
  sortDir: 'asc' | 'desc' = 'desc';
  filterLabel: string = '';
  searchQuery: string = '';

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
      switch (this.sortBy) {
        case 'label': valA = a.label ?? ''; valB = b.label ?? ''; break;
        case 'type': valA = a.mime_type ?? ''; valB = b.mime_type ?? ''; break;
        case 'size': valA = a.size; valB = b.size; break;
        case 'date': valA = new Date(a.uploaded_at).getTime(); valB = new Date(b.uploaded_at).getTime(); break;
      }
      if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    this.filteredDocuments = docs;
  }

  setSort(field: 'label' | 'type' | 'size' | 'date') {
    if (this.sortBy === field && (field === 'size' || field === 'date')) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else { this.sortBy = field; this.sortDir = 'desc'; }
    this.applySort();
  }

  openFolder(folder: any) { this.breadcrumb.push(this.currentFolder); this.currentFolder = folder; this.load(); }
  goBack() { this.currentFolder = this.breadcrumb.pop(); this.load(); }
  goHome() { this.breadcrumb = []; this.currentFolder = null; this.load(); }

  createFolder() {
    if (!this.newFolderName.trim()) return;
    this.docService.createFolder(this.newFolderName.trim(), this.currentFolder?.id ?? null)
      .subscribe(() => { this.newFolderName = ''; this.showNewFolderInput = false; this.load(); });
  }
  startRenameFolder(folder: any) { this.renamingFolder = folder; this.renameValue = folder.name; }
  submitRenameFolder() {
    if (!this.renameValue.trim() || !this.renamingFolder) return;
    this.docService.renameFolder(this.renamingFolder.id, this.renameValue.trim())
      .subscribe(() => { this.renamingFolder = null; this.load(); });
  }
  deleteFolder(folder: any) {
    if (!confirm(`Delete folder "${folder.name}" and all its files?`)) return;
    this.docService.deleteFolder(folder.id).subscribe(() => this.load());
  }

  onFileSelected(event: any) { this.selectedFile = event.target.files[0] || null; }
  uploadFile() {
    if (!this.selectedFile) return;
    const targetFolder = this.uploadFolderId;
    this.docService.uploadDocument(this.selectedFile, targetFolder).subscribe({
      next: (doc: any) => {
        if (this.uploadLabel) {
          this.docService.updateDocument(doc.id, doc.original_name, targetFolder, this.uploadLabel)
            .subscribe(() => { this.resetUpload(); this.load(); });
        } else { this.resetUpload(); this.load(); }
      },
      error: (e) => alert(e.error?.message || 'Upload failed')
    });
  }
  resetUpload() { this.selectedFile = null; this.uploadFolderId = this.currentFolder?.id ?? null; this.uploadLabel = null; }

  startRenameDocument(doc: any) { this.renamingDocument = doc; this.renameValue = doc.original_name; }
  submitRenameDocument() {
    if (!this.renameValue.trim() || !this.renamingDocument) return;
    this.docService.updateDocument(this.renamingDocument.id, this.renameValue.trim(), this.renamingDocument.folder_id, this.renamingDocument.label)
      .subscribe(() => { this.renamingDocument = null; this.load(); });
  }
  deleteDocument(doc: any) {
    if (!confirm(`Delete "${doc.original_name}"?`)) return;
    this.docService.deleteDocument(doc.id).subscribe(() => this.load());
  }
  startEditLabel(doc: any) { this.editingLabelDoc = doc; this.editLabelValue = doc.label ?? null; }
  submitEditLabel() {
    if (!this.editingLabelDoc) return;
    this.docService.updateDocument(this.editingLabelDoc.id, this.editingLabelDoc.original_name, this.editingLabelDoc.folder_id, this.editLabelValue)
      .subscribe(() => { this.editingLabelDoc = null; this.load(); });
  }
  openMoveModal(doc: any) { this.movingDocument = doc; this.moveTargetFolderId = doc.folder_id ?? null; }
  closeMoveModal() { this.movingDocument = null; }
  submitMove() {
    if (!this.movingDocument) return;
    this.docService.updateDocument(this.movingDocument.id, this.movingDocument.original_name, this.moveTargetFolderId, this.movingDocument.label)
      .subscribe(() => { this.movingDocument = null; this.load(); });
  }

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
  showInfo(doc: any) { this.infoDoc = this.infoDoc?.id === doc.id ? null : doc; }

  createLabel() {
    if (!this.newLabelName.trim()) return;
    this.docService.createLabel(this.newLabelName.trim()).subscribe({
      next: () => { this.newLabelName = ''; this.loadLabels(); },
      error: (e) => alert(e.error?.message || 'Failed to create label')
    });
  }
  startRenameLabel(label: any) { this.renamingLabel = label; this.renameLabelValue = label.name; }
  submitRenameLabel() {
    if (!this.renameLabelValue.trim() || !this.renamingLabel) return;
    this.docService.renameLabel(this.renamingLabel.id, this.renameLabelValue.trim())
      .subscribe(() => { this.renamingLabel = null; this.loadLabels(); });
  }
  deleteLabel(label: any) {
    if (!confirm(`Delete label "${label.name}"?`)) return;
    this.docService.deleteLabel(label.id).subscribe(() => this.loadLabels());
  }

  logout() { this.authService.logout(); this.router.navigate(['/login']); }
  folderNameById(id: number | null): string {
    if (id == null) return 'Root';
    return this.allFolders.find(f => f.id === id)?.name ?? 'Unknown';
  }
  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  getLabelNames(): string[] { return this.labels.map(l => l.name); }
}
