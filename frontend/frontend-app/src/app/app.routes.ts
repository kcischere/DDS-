import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  // --- ADMIN ROUTES ---
  {
    path: 'admin/users',
    loadComponent: () => import('./admin/users/admin-users').then((m) => m.AdminUsers),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin/documents',
    loadComponent: () => import('./admin/documents/admin-documents').then((m) => m.AdminDocuments),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin/information',
    loadComponent: () => import('./admin/information/admin-information').then((m) => m.AdminInformation),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin/status',
    loadComponent: () => import('./admin/status/admin-status').then((m) => m.AdminStatus),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin/myinfo',
    loadComponent: () => import('./admin/myinfo/admin-myinfo').then((m) => m.AdminMyInfo),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  // --- USER ROUTES ---
  {
    path: 'user/myinfo',
    loadComponent: () => import('./user/myinfo/user-myinfo').then((m) => m.UserMyInfo),
    canActivate: [authGuard],
    data: { roles: ['User'] }
  },
  {
    path: 'user/documents',
    loadComponent: () => import('./user/documents/user-documents').then((m) => m.UserDocuments),
    canActivate: [authGuard],
    data: { roles: ['User'] }
  },
];
