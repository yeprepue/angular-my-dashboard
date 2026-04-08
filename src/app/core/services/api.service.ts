/**
 * Servicio base de API
 * ISO 27001 Compliant - Manejo centralizado de requests HTTP
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, filter, map } from 'rxjs/operators';
import { ApiResponse, ApiError } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = environment.apiUrl || 'http://localhost:3000/api';
  private readonly REQUEST_TIMEOUT = 30000; // 30 segundos

  constructor(private http: HttpClient) {}

  /**
   * Realiza una solicitud GET
   * @param endpoint - Ruta relativa del endpoint
   * @param options - Opciones adicionales de HTTP
   */
  get<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
    return this.http
      .get<ApiResponse<T>>(`${this.API_BASE_URL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(options?.headers)
      })
      .pipe(
        filter(event => event instanceof HttpResponse),
        map(response => (response as HttpResponse<ApiResponse<T>>).body as ApiResponse<T>),
        timeout(this.REQUEST_TIMEOUT),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Realiza una solicitud POST
   * @param endpoint - Ruta relativa del endpoint
   * @param data - Datos a enviar
   * @param options - Opciones adicionales de HTTP
   */
  post<T>(endpoint: string, data: any, options?: any): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(`${this.API_BASE_URL}${endpoint}`, data, {
        ...options,
        headers: this.getHeaders(options?.headers)
      })
      .pipe(
        filter(event => event instanceof HttpResponse),
        map(response => (response as HttpResponse<ApiResponse<T>>).body as ApiResponse<T>),
        timeout(this.REQUEST_TIMEOUT),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Realiza una solicitud PUT
   * @param endpoint - Ruta relativa del endpoint
   * @param data - Datos a enviar
   * @param options - Opciones adicionales de HTTP
   */
  put<T>(endpoint: string, data: any, options?: any): Observable<ApiResponse<T>> {
    return this.http
      .put<ApiResponse<T>>(`${this.API_BASE_URL}${endpoint}`, data, {
        ...options,
        headers: this.getHeaders(options?.headers)
      })
      .pipe(
        filter(event => event instanceof HttpResponse),
        map(response => (response as HttpResponse<ApiResponse<T>>).body as ApiResponse<T>),
        timeout(this.REQUEST_TIMEOUT),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Realiza una solicitud DELETE
   * @param endpoint - Ruta relativa del endpoint
   * @param options - Opciones adicionales de HTTP
   */
  delete<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(`${this.API_BASE_URL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(options?.headers)
      })
      .pipe(
        filter(event => event instanceof HttpResponse),
        map(response => (response as HttpResponse<ApiResponse<T>>).body as ApiResponse<T>),
        timeout(this.REQUEST_TIMEOUT),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Realiza una solicitud PATCH
   * @param endpoint - Ruta relativa del endpoint
   * @param data - Datos a enviar
   * @param options - Opciones adicionales de HTTP
   */
  patch<T>(endpoint: string, data: any, options?: any): Observable<ApiResponse<T>> {
    return this.http
      .patch<ApiResponse<T>>(`${this.API_BASE_URL}${endpoint}`, data, {
        ...options,
        headers: this.getHeaders(options?.headers)
      })
      .pipe(
        filter(event => event instanceof HttpResponse),
        map(response => (response as HttpResponse<ApiResponse<T>>).body as ApiResponse<T>),
        timeout(this.REQUEST_TIMEOUT),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Obtiene los headers HTTP con configuraciones de seguridad
   * ISO 27001 - Headers de seguridad
   */
  private getHeaders(customHeaders?: any): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-API-Version': '1.0'
    });

    if (customHeaders) {
      Object.keys(customHeaders).forEach(key => {
        headers = headers.set(key, customHeaders[key]);
      });
    }

    return headers;
  }

  /**
   * Maneja errores HTTP de forma centralizada
   * ISO 27001 - Logging y tratamiento seguro de errores
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let apiError: ApiError = {
      code: error.status?.toString() || 'UNKNOWN',
      message: 'Error en la solicitud al servidor',
      timestamp: new Date()
    };

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      apiError = {
        code: 'CLIENT_ERROR',
        message: error.error.message,
        timestamp: new Date()
      };
    } else {
      // Error del servidor
      apiError = {
        code: error.status?.toString() || 'SERVER_ERROR',
        message: error.error?.message || error.statusText || 'Error del servidor',
        details: error.error?.errors,
        timestamp: new Date()
      };
    }

    // Log de errores (en producción esto iría a un servicio de logging)
    console.error('[API Error]', apiError);

    return throwError(() => apiError);
  }
}
