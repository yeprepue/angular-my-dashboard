/**
 * Interceptor de JWT
 * ISO 27001 Compliant - Inyección automática de tokens en requests
 */

import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Agregar token a las solicitudes autenticadas
    if (this.shouldAddToken(request)) {
      const token = this.tokenService.getToken();
      if (token) {
        request = this.addToken(request, token);
      }
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Determina si se debe agregar el token a la solicitud
   */
  private shouldAddToken(request: HttpRequest<any>): boolean {
    // No agregar token a solicitudes públicas
    const publicEndpoints = ['/Auth/login', '/Auth/registro', '/Auth/forgot-password', '/Auth/reset-password'];
    return !publicEndpoints.some(endpoint => request.url.includes(endpoint));
  }

  /**
   * Agrega el token JWT al header de la solicitud
   */
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Maneja errores 401 (No autorizado)
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();
      if (refreshToken) {
        // Aquí puedes implementar la lógica de refresh token si tu backend lo soporta
        // Por ahora, simplemente hacemos logout
        this.authService.logout();
        return throwError(() => new Error('Session expired'));
      }
    } else {
      // Esperar a que el token se refresque
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        })
      );
    }

    this.authService.logout();
    return throwError(() => new Error('Session expired'));
  }
}
