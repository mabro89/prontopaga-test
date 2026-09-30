# ProntoPaga API

Backend API desarrollado con Express, TypeScript.

## Requisitos previos

- **Node.js**: v20 o superior
- **pnpm**: v9 o superior (o npm / yarn)

## Instalación

1. Clona el repositorio e ingresa a la carpeta `api`:

   ```bash
   cd api
   ```

2. Instala las dependencias:

   ```bash
   pnpm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```

## Ejecución

### Modo desarrollo

Inicia el servidor con recarga en caliente (`tsx watch`):

```bash
pnpm run dev
```

Por defecto, la API se ejecutará en: `http://localhost:3001` (o en el puerto definido en la variable `PORT`).

### Modo producción

Compila el código TypeScript a JavaScript y ejecuta:

```bash
pnpm run build
pnpm start
```

## Scripts disponibles

- `pnpm run dev`: Inicia el servidor en modo desarrollo.
- `pnpm run build`: Compila el código TypeScript a la carpeta `dist`.
- `pnpm start`: Ejecuta la aplicación compilada en producción.
- `pnpm run typecheck`: Valida el tipado estático con TypeScript (`tsc --noEmit`).
- `pnpm run lint`: Ejecuta el linter ESLint.
- `pnpm run lint:fix`: Corrige automáticamente problemas de linter y formato.
- `pnpm run format`: Formatea el código con Prettier.

## Usuarios de prueba iniciales (Seed)

Al iniciar la aplicación, se precargan los siguientes usuarios en el repositorio en memoria:

| Rol       | Email                       | Contraseña  | RUT            |
| --------- | --------------------------- | ----------- | -------------- |
| **ADMIN** | `admin@prontopaga.com`      | `Admin123!` | `11.111.111-1` |
| **USER**  | `juan.perez@prontopaga.com` | `User123!`  | `22.222.222-2` |

## Endpoints principales

### Estado

- `GET /health`: Healthcheck del servicio.

### Autenticación (`/api/auth`)

- `POST /api/auth/register`: Registro de nuevos usuarios y emisión de tokens.
- `POST /api/auth/login`: Inicio de sesión (retorna `accessToken` en el body y establece `refreshToken` en cookie `httpOnly` para la ruta `/api/auth/refresh`).
- `POST /api/auth/refresh`: Rotación y renovación de tokens mediante la cookie `httpOnly`.
- `POST /api/auth/logout`: Cierre de sesión y limpieza de la cookie.

### Usuarios (`/api/users`) - Requiere cabecera `Authorization: Bearer <accessToken>`

- `GET /api/users`: Lista todos los usuarios (solo rol `ADMIN`).
- `GET /api/users?rut=<rut>`: Consulta el score de un usuario por su RUT (solo rol `ADMIN` o el propio usuario).
- `POST /api/users`: Registra un usuario (solo rol `ADMIN`).
- `GET /api/users/me/score`: Obtiene el score financiero del usuario autenticado (`{ rut, score, date }`).
- `GET /api/users/:id`: Obtiene datos de un usuario (solo rol `ADMIN` o el propio usuario).
- `GET /api/users/:id/score`: Obtiene el score de un usuario por ID (solo rol `ADMIN` o el propio usuario).
