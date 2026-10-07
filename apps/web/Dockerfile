# -------------------------------------------------------------
# Stage 1: Build (React + Vite SPA en Monorepo)
# -------------------------------------------------------------
FROM node:22-alpine AS builder

# Activar pnpm mediante corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 1. Copiar manifiestos base del workspace para aprovechar la caché de Docker
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/

# 2. Instalar dependencias del workspace
RUN pnpm install --frozen-lockfile

# 3. Copiar código fuente y archivos de apps/web
COPY apps/web ./apps/web

# 4. Compilar la SPA para producción (genera apps/web/dist)
RUN pnpm --filter web build

# -------------------------------------------------------------
# Stage 2: Runner (Servidor Nginx ultra ligero)
# -------------------------------------------------------------
FROM nginx:alpine AS runner

# Copiar configuración con soporte para SPA y proxy reverso
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos generados
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
