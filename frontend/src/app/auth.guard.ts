import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service'; 

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  const userRole = authService.getUserRole();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = route.data['roles'] as Array<string>;
  
  if (expectedRoles && !expectedRoles.includes(userRole || '')) {
    
    router.navigate(['/documents']);
    return false;
  }

  return true;
};