/**
 * Componente de Login
 * ISO 27001 Compliant - Autenticación segura
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToAuthState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el formulario de login
   */
  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Se suscribe al estado de autenticación
   */
  private subscribeToAuthState(): void {
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
        if (isLoading) {
          this.loginForm.get('email')?.disable();
          this.loginForm.get('password')?.disable();
        } else {
          this.loginForm.get('email')?.enable();
          this.loginForm.get('password')?.enable();
        }
      });
  }

  /**
   * Realiza el login
   */
  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials: LoginRequest = this.loginForm.value;
    this.errorMessage = '';

    this.authService
      .login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: error => {
          this.errorMessage = error.message || 'Error al iniciar sesión. Verifique sus credenciales.';
          this.loginForm.reset();
        }
      });
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Obtiene el control de formulario
   */
  getControl(controlName: string) {
    return this.loginForm.get(controlName);
  }

  /**
   * Navega al registro
   */
  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  /**
   * Navega a recuperación de contraseña
   */
  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName === 'email' ? 'Email' : 'Contraseña'} es requerido`;
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return 'Mínimo 6 caracteres';
    }
    return '';
  }
}
