/**
 * Componente de Reset Contraseña
 * ISO 27001 Compliant - Cambio seguro de contraseña
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ResetPasswordRequest } from '../../../core/models';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  resetPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token: string = '';
  showPassword = false;

  ngOnInit(): void {
    this.getTokenFromUrl();
    this.initializeForm();
    this.subscribeToAuthState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Extrae el token de la URL.
   * Usa snapshot primero (captura en recarga de página / acceso directo)
   * y se suscribe a `params` para cambios dinámicos dentro de Angular.
   */
  private getTokenFromUrl(): void {
    // Captura inmediata el parámetro del snapshot
    this.token = this.activatedRoute.snapshot.params['token'] || '';

    // Se suscribe a cambios dinámicos de parámetros
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.token = params['token'] || '';
      });
  }

  private initializeForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  private subscribeToAuthState(): void {
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });
  }

  onResetPassword(): void {
    if (this.resetPasswordForm.invalid || !this.token) {
      this.errorMessage = 'Enlace de recuperación inválido o expirado';
      return;
    }

    const data: ResetPasswordRequest = {
      token: this.token,
      newPassword: this.resetPasswordForm.value.newPassword
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .resetPassword(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Contraseña actualizada correctamente. Redirigiendo al login...';
          this.resetPasswordForm.reset();

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: error => {
          this.errorMessage = error.message || 'Error al cambiar la contraseña. El enlace puede haber expirado.';
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.resetPasswordForm.get(fieldName);

    if (control?.hasError('required')) {
      return 'Contraseña es requerida';
    }

    if (control?.hasError('minlength')) {
      return 'Mínimo 8 caracteres';
    }

    return '';
  }
}
