import { Routes } from '@angular/router';

export const routes: Routes = [
  // ==========================================
  // 1. RUTAS PÚBLICAS (Pantalla completa)
  // ==========================================
  {
    path: 'inicio', // Entras con localhost:4200/inicio
    title: 'Pre-salud | Bienvenido',
    loadComponent: () => import('./dashboard/pages/landing/landing.component')
  },

  // Aquí irá tu Login más adelante...
  // { path: 'login', loadComponent: ... }

  // ==========================================
  // 2. RUTAS PRIVADAS (Con el menú del Dashboard)
  // ==========================================
  {
    path: 'dashboard',
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
      // ... (puedes dejar el resto de tus rutas de ejemplo aquí) ...

      // Ruta por defecto DENTRO del dashboard
      {
        path: '',
        redirectTo: 'control-flow', // O la que quieras que sea la pantalla principal del panel
        pathMatch: 'full',
      }
    ]
  },

  // ==========================================
  // 3. RUTA POR DEFECTO GLOBAL
  // ==========================================
  {
    path: '',
    redirectTo: '/inicio', // Apenas abra la app, lo mandamos a la Landing
    pathMatch: 'full'
  },

  // Comodín para páginas no encontradas (Error 404)
  {
    path: '**',
    redirectTo: '/inicio'
  }
];
