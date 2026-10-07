# -------------------------------------------------------------
# Stage 1: Build & Prune (Monorepo Workspace)
# -------------------------------------------------------------
FROM node:22-alpine AS builder

# Activar pnpm mediante corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 1. Copiar manifiestos base del workspace para aprovechar la caché de Docker
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/

# 2. Instalar dependencias del workspace
RUN pnpm install --frozen-lockfile

# 3. Copiar código fuente de apps/api
COPY apps/api ./apps/api

# 4. Compilar TypeScript
RUN pnpm --filter prontopaga-api build

# 5. Desplegar paquete aislado con solo dependencias de producción (excluye devDependencies)
RUN pnpm --filter prontopaga-api --prod deploy /app/pruned

# -------------------------------------------------------------
# Stage 2: Runner (Imagen mínima para producción)
# -------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar la aplicación lista desde el builder con permisos para el usuario node
COPY --chown=node:node --from=builder /app/pruned ./
COPY --chown=node:node --from=builder /app/apps/api/dist ./dist

# Usuario no root para mejores prácticas de seguridad
USER node

EXPOSE 3001

CMD ["node", "dist/index.js"]
