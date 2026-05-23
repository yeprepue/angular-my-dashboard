# MyDashboard

Aplicación frontend desarrollada con **Angular 17** y **Tailwind CSS** que sirve para practicar características nuevas de Angular. Este proyecto funciona como cliente de un backend API REST.

---

## Tecnologías del Proyecto

| Tecnología | Versión |
|---|---|
| Angular | ^17.3.0 |
| Tailwind CSS | ^3.4.19 |
| TypeScript | ~5.2.2 |
| RxJS | ~7.8.0 |

---

## Backend Utilizado

La aplicación se conecta a un backend **ASP.NET Core** que expone una API REST. La configuración se define en `src/environments/environment.ts`.

| Entorno | URL | Archivo |
|---|---|---|
| **Desarrollo (Development)** | `http://localhost:5031/api` | `environment.ts` |
| **Producción (Production)** | `https://api.presalud.com/api` | `environment.prod.ts` |

### Características del Backend

- **Autenticación**: JWT (JSON Web Tokens) con interceptor automático (`JwtInterceptor`).
- **Endpoints públicos** (no requieren token):
  - `POST /Auth/login` — Inicio de sesión
  - `POST /Auth/registro` — Registro de usuario
  - `POST /Auth/forgot-password` — Recuperar contraseña
  - `POST /Auth/reset-password` — Restablecer contraseña
- **Comunicación**: Servicio centralizado `ApiService` (`src/app/core/services/api.service.ts`) con métodos `get`, `post`, `put`, `delete` y `patch`.
- **Seguridad**: Cumplimiento **ISO 27001** — manejo centralizado de errores, headers de seguridad y logging.

---

## Flujo de Recuperación de Contraseña

El flujo funciona en **dos pasos** vía los endpoints públicos del backend:

```
Paso 1: Solicitar recuperación
──────────────────────────────────────────────────────
POST /Auth/forgot-password
Body: { "email": "usuario@example.com" }
→ El backend envía un correo con un enlace que incluye
  un token temporal: /auth/reset-password/:token

Paso 2: Establecer nueva contraseña
──────────────────────────────────────────────────────
POST /Auth/reset-password
Body: { "token": "TOKEN_DEL_CORREO", "newPassword": "nuevaClave123" }
→ La contraseña se actualiza exitosamente. El token es
  consumido y no puede reutilizarse.
```

| Endpoint | Método | Body | Propósito |
|---|---|---|---|
| `/Auth/forgot-password` | POST | `{ email }` | Enviar enlace de recuperación al correo |
| `/Auth/reset-password` | POST | `{ token, newPassword }` | Cambiar la contraseña con el token recibido |

### Rutas del Frontend

| Ruta | Componente | Propósito |
|---|---|---|
| `/auth/forgot-password` | `ForgotPasswordComponent` | Formulario para ingresar el email |
| `/auth/reset-password/:token` | `ResetPasswordComponent` | Formulario para establecer nueva contraseña |

> **Importante**: El token se extrae de la URL usando `ActivatedRoute.snapshot.params['token']` para soportar recarga de página o acceso directo desde el correo electrónico.

---

## Configuración Inicial

### Prerrequisitos

- Node.js >= 18
- Backend corriendo en el puerto `5031` (desarrollo) o la URL de producción configurada en `environment.prod.ts`

### Estructura del proyecto

```
src/
├── app/
│   ├── core/                   # Código compartido (sin feature)
│   │   ├── guards/             # AuthGuard, RoleGuard
│   │   ├── interceptors/       # JwtInterceptor
│   │   ├── models/             # Tipos TypeScript (auth.models.ts)
│   │   └── services/           # ApiService, AuthService, TokenService
│   ├── features/
│   │   ├── auth/               # Módulo de autenticación
│   │   └── appointments/       # Módulo de citas médicas
│   └── dashboard/              # Panel principal (privado)
└── environments/
    ├── environment.ts          # Config desarrollo
    └── environment.prod.ts     # Config producción
```

### Comandos Dev

1. Clonar el proyecto
2. Instalar dependencias: `npm install`
3. Ejecutar el proyecto: `ng serve -o`


