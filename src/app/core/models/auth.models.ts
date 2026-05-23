/**
 * Modelos de Autenticación
 * ISO 27001 Compliant - Gestión segura de credenciales y sesiones
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiracion: string;
  refreshToken?: string;
  usuario: {
    id: number;
    nombreCompleto: string;
    email: string;
    rolId: number;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface User {
  id: number;
  nombreCompleto: string;
  email: string;
  rolId: number;
}

export enum UserRole {
  ADMIN = 1,
  USER = 2,
  GUEST = 3
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface JwtPayload {
  sub: string;
  nombre: string;
  email: string;
  role: number;
  iat: number;
  exp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}
