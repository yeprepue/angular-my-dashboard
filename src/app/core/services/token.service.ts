/**
 * Servicio de Tokens JWT
 * ISO 27001 Compliant - Gestión segura de tokens en localStorage
 */

import { Injectable } from '@angular/core';
import { JwtPayload, User, UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_BUFFER = 5 * 60; // 5 minutos antes de expiración

  /**
   * Guarda el token en localStorage
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error guardando token:', error);
    }
  }

  /**
   * Obtiene el token de localStorage
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Guarda el refresh token
   */
  setRefreshToken(token: string): void {
    try {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error guardando refresh token:', error);
    }
  }

  /**
   * Obtiene el refresh token
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo refresh token:', error);
      return null;
    }
  }

  /**
   * Elimina los tokens
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error eliminando tokens:', error);
    }
  }

  /**
   * Decodifica y retorna el payload del JWT
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const decoded = JSON.parse(atob(parts[1]));
      return decoded as JwtPayload;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  /**
   * Verifica si el token es válido
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = this.decodeToken(token);
    if (!payload) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTime = payload.exp - this.TOKEN_EXPIRY_BUFFER;

    return currentTime < expiryTime;
  }

  /**
   * Obtiene el usuario del token
   */
  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);
    if (!payload) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      firstName: '',
      lastName: '',
      createdAt: new Date(),
      isActive: true
    };
  }

  /**
   * Obtiene el rol del usuario desde el token
   */
  getUserRole(): UserRole | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);
    return payload?.role || null;
  }

  /**
   * Verifica si el token está a punto de expirar
   */
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = this.decodeToken(token);
    if (!payload) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTime = payload.exp;
    const timeUntilExpiry = expiryTime - currentTime;

    // Retorna true si expira en menos de 5 minutos
    return timeUntilExpiry < this.TOKEN_EXPIRY_BUFFER;
  }
}
