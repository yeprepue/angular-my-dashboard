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

## Configuración Inicial

### Prerrequisitos

- Node.js >= 18
- Backend corriendo en el puerto `5031` (desarrollo) o la URL de producción configurada en `environment.prod.ts`

### Comandos Dev

1. Clonar el proyecto
2. Instalar dependencias: `npm install`
3. Ejecutar el proyecto: `ng serve -o`


