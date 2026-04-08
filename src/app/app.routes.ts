import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  // ==========================================
  // 1. RUTAS PÚBLICAS (Sin autenticación)
  // ==========================================
  {
    path: 'inicio',
    title: 'Pre-salud | Bienvenido',
    loadComponent: () => import('./dashboard/pages/landing/landing.component')
  },

  // RUTAS DE AUTENTICACIÓN
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        title: 'Pre-salud | Iniciar Sesión',
        loadComponent: () => import('./features/auth/pages/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        title: 'Pre-salud | Registrarse',
        loadComponent: () => import('./features/auth/pages/register.component').then(m => m.RegisterComponent),
      },
      {
        path: 'forgot-password',
        title: 'Pre-salud | Recuperar Contraseña',
        loadComponent: () => import('./features/auth/pages/forgot-password.component').then(m => m.ForgotPasswordComponent),
      },
      {
        path: 'reset-password/:token',
        title: 'Pre-salud | Cambiar Contraseña',
        loadComponent: () => import('./features/auth/pages/reset-password.component').then(m => m.ResetPasswordComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // ==========================================
  // 2. RUTAS PRIVADAS (Con autenticación)
  // ==========================================
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'change-detection',
        title: 'Change Detection',
        loadComponent: () => import('./dashboard/pages/change-detection/change-detection.component'),
      },
      {
        path: 'control-flow',
        title: 'Control Flow',
        loadComponent: () => import('./dashboard/pages/control-flow/control-flow.component'),
      },
      {
        path: 'user-list',
        title: 'User List',
        loadComponent: () => import('./dashboard/pages/users/users.component'),
      },
      {
        path: 'citas',
        title: 'Citas Médicas',
        loadComponent: () => import('./features/appointments/pages/appointments.component').then(m => m.AppointmentsComponent),
      },
      {
        path: '',
        redirectTo: 'control-flow',
        pathMatch: 'full',
      }
    ]
  },

  // ==========================================
  // 3. RUTA POR DEFECTO GLOBAL
  // ==========================================
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },

  // Comodín para páginas no encontradas
  {
    path: '**',
    redirectTo: '/inicio'
  }
];
