# ProntoPaga - Evaluación Técnica

Monorepo con Backend API (Express, Hexagonal, TypeScript) y Frontend Web (React, Vite, Tailwind CSS, Zustand).

---

## Cómo ejecutar los proyectos

### 1. Iniciar la API (Backend)
```bash
cd api
pnpm install
pnpm run dev
```
> La API se ejecutará en **`http://localhost:3001`**.

### 2. Iniciar la Web (Frontend)
En otra terminal:
```bash
cd web
pnpm install
pnpm run dev
```
> La aplicación web se ejecutará en **`http://localhost:5173`** y se conecta automáticamente a la API en el puerto 3001.

---

## Usuarios de prueba

| Rol | Email | Contraseña | RUT | Permiso Score |
|---|---|---|---|---|
| **ADMIN** | `admin@prontopaga.com` | `Admin123!` | `11.111.111-1` | Consulta todos los RUTs |
| **USER** | `juan.perez@prontopaga.com` | `User123!` | `22.222.222-2` | Solo su propio RUT |

---

## Notas de Desarrollo y Uso de IA

Basicamente me apoyé de gemini como herramienta ia para iniciar la base del proyecto, indicandole la arquitectura que queria usar, las librerias, generar los esquemas. Le indique el modelo que usaria para la entidad de usuario y que generar las validaciones con zod. tambien me fue completando implementaciones una vez que extendia las clases para los servicios y casos de uso.

Para el frontend fue similar en lo que respecta al inicio del proyecto, isntalacion de librerias que usaria, me genero y configuró el inicio del proyecto para no partir de 0. Tambien le pido ayuda con los esquemas y validaciones de los modelos y el tipado que estaba usando en el backend.
Me ayudo con el estilo del frontend al crear los componentes, completando el template y estilos.

En general ayudó completando textos de las app en mensajes de error y otros y tambien generando utilidades como para la revision del formato del rut por ejemplo o como funciones que no incluí en los store.
