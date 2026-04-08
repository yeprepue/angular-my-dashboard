/**
 * Guard de Autenticación
 * ISO 27001 Compliant - Protección de rutas privadas
 */

import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Verificar si hay token válido
  const token = tokenService.getToken();
  const isValid = tokenService.isTokenValid();

  if (token && isValid) {
    // Usuario autenticado
    return true;
  }

  // Redirigir a login
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
