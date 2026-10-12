# Etapa 1: Construcción (Build)
FROM node:20-alpine AS builder

# Instalar pnpm de forma global
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente (aquí ya viene configurado tu frontend)
COPY . .

# Ejecutar el build de producción con Vite (aquí Vite lee lo que necesite)
RUN pnpm build

# Etapa 2: Servidor Web con Nginx para producción
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa anterior al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar nuestra configuración de Nginx para que maneje las rutas y el proxy de /api
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para Dokploy
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]