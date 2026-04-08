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
  showConfirmPassword = false;

  ngOnInit(): void {
    this.getTokenFromUrl();
    this.initializeForm();
    this.subscribeToAuthState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getTokenFromUrl(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.token = params['token'] || '';
      });
  }

  private initializeForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private subscribeToAuthState(): void {
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });
  }

  private passwordMatchValidator(formGroup: FormGroup): { [key: string]: any } | null {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onResetPassword(): void {
    if (this.resetPasswordForm.invalid || !this.token) {
      this.errorMessage = 'Enlace de recuperación inválido o expirado';
      return;
    }

    const data: ResetPasswordRequest = {
      token: this.token,
      newPassword: this.resetPasswordForm.value.newPassword,
      confirmPassword: this.resetPasswordForm.value.confirmPassword
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

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
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
      return `${fieldName === 'newPassword' ? 'Contraseña' : 'Confirmar Contraseña'} es requerido`;
    }

    if (control?.hasError('minlength')) {
      return 'Mínimo 8 caracteres';
    }

    return '';
  }

  hasPasswordMismatch(): boolean {
    return (this.resetPasswordForm.hasError('passwordMismatch') ?? false) &&
           (this.resetPasswordForm.get('confirmPassword')?.touched ?? false);
  }
}
