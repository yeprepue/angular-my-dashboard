/**
 * Servicio de Autenticación
 * ISO 27001 Compliant - Gestión de sesiones y tokens JWT
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
  LoginRequest,
  LoginResponse,
  User,
  RegisterRequest,
  AuthState,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../models';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private tokenService = inject(TokenService);

  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  authState$ = this.authStateSubject.asObservable();
  isAuthenticated$ = this.authState$.pipe(map(state => state.isAuthenticated));
  user$ = this.authState$.pipe(map(state => state.user));
  isLoading$ = this.authState$.pipe(map(state => state.isLoading));

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Inicializa el estado de autenticación desde el localStorage
   */
  private initializeAuthState(): void {
    const token = this.tokenService.getToken();
    if (token && this.tokenService.isTokenValid()) {
      const user = this.tokenService.getUserFromToken();
      this.authStateSubject.next({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    }
  }

  /**
   * Login del usuario
   * @param credentials - Email y contraseña
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);
    return this.apiService
      .post<LoginResponse>('/Auth/login', credentials)
      .pipe(
        map(response => response.data!),
        tap(response => {
          this.tokenService.setToken(response.token);
          if (response.refreshToken) {
            this.tokenService.setRefreshToken(response.refreshToken);
          }
          this.authStateSubject.next({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        }),
        catchError(error => {
          this.setError(error.message);
          throw error;
        })
      );
  }

  /**
   * Registro de nuevo usuario
   * @param data - Datos del registro
   */
  register(data: RegisterRequest): Observable<LoginResponse> {
    this.setLoading(true);
    return this.apiService
      .post<LoginResponse>('/Auth/registro', data)
      .pipe(
        map(response => response.data!),
        tap(response => {
          this.tokenService.setToken(response.token);
          if (response.refreshToken) {
            this.tokenService.setRefreshToken(response.refreshToken);
          }
          this.authStateSubject.next({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        }),
        catchError(error => {
          this.setError(error.message);
          throw error;
        })
      );
  }

  /**
   * Solicita reset de contraseña
   * @param data - Email del usuario
   */
  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    this.setLoading(true);
    return this.apiService
      .post('/Auth/forgot-password', data)
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(error => {
          this.setError(error.message);
          throw error;
        })
      );
  }

  /**
   * Resetea la contraseña
   * @param data - Token y nueva contraseña
   */
  resetPassword(data: ResetPasswordRequest): Observable<any> {
    this.setLoading(true);
    return this.apiService
      .post('/Auth/reset-password', data)
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(error => {
          this.setError(error.message);
          throw error;
        })
      );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.tokenService.clearTokens();
    this.authStateSubject.next({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  /**
   * Actualiza el estado de carga
   */
  private setLoading(isLoading: boolean): void {
    const state = this.authStateSubject.value;
    this.authStateSubject.next({
      ...state,
      isLoading
    });
  }

  /**
   * Establece error
   */
  private setError(error: string | null): void {
    const state = this.authStateSubject.value;
    this.authStateSubject.next({
      ...state,
      isLoading: false,
      error
    });
  }

  /**
   * Limpia errores
   */
  clearError(): void {
    const state = this.authStateSubject.value;
    this.authStateSubject.next({
      ...state,
      error: null
    });
  }
}
