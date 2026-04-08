import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export default class LandingComponent {
  private router = inject(Router);

  goToLogin(userType: 'patient' | 'doctor'): void {
    // Guardamos el tipo de usuario seleccionado
    sessionStorage.setItem('selectedUserType', userType);
    this.router.navigate(['/auth/login']);
  }
}
