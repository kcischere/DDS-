import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users').then((m) => m.Users),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'documents',
    loadComponent: () => import('./users/users').then((m) => m.Users),
    canActivate: [authGuard],
    data: { roles: ['Admin', 'User'] }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
  path: 'logs',
  loadComponent: () => import('./logs/logs').then((m) => m.Logs),
  canActivate: [authGuard],
  data: { roles: ['Admin'] }
  }

];