/**
 * Guard de Roles
 * ISO 27001 Compliant - Control de acceso basado en roles
 */

import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserRole } from '../models';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    const userRole = tokenService.getUserRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirigir a acceso denegado o inicio
    router.navigate(['/']);
    return false;
  };
};
