# FootGamer's — Frontend

Interfaz web de FootGamer's para acceder a una comunidad de torneos y partidos, gestionar la sesión y navegar por paneles diferenciados para administradores y jugadores.

## Tecnologías

| Componente               | Tecnología     |
| ------------------------ | -------------- |
| Interfaz                 | React 19       |
| Lenguaje                 | TypeScript 6   |
| Desarrollo y compilación | Vite 8         |
| Rutas                    | React Router 7 |
| Estilos                  | Tailwind CSS 4 |
| Análisis estático        | Oxlint         |
| Dependencias             | pnpm           |
| Despliegue               | Docker y Nginx |

Las versiones declaradas están en [package.json](package.json); [pnpm-lock.yaml](pnpm-lock.yaml) fija las dependencias instaladas.

## Estado actual

- Landing pública y página de inicio de sesión.
- Registro e inicio de sesión contra el backend.
- Retorno de autenticación OAuth2 con Google y Discord.
- Persistencia de sesión JWT y navegación protegida por rol.
- Edición de perfil, cambio de contraseña y subida de avatar mediante el cliente de autenticación.
- Layouts y dashboards para administrador y jugador.

Los paneles consultan el backend autenticado: contadores, listados paginados, formularios y detalles de torneos y partidos. El administrador gestiona usuarios, jugadores, categorías, bandos, trofeos y participaciones; ambos roles consultan sus torneos, partidos y trofeos.

## Requisitos

- Node.js compatible con las dependencias del lockfile: usa Node.js 22.12 o posterior.
- pnpm disponible en la terminal.
- Backend FootGamer's activo para las operaciones de autenticación y perfil.
- Docker solo para ejecutar el despliegue en contenedores.

## Instalación local

Ejecuta los comandos desde la raíz del frontend.

### 1. Instalar dependencias

Si tu instalación incluye Corepack, puedes habilitar pnpm mediante `corepack enable`. Si no lo incluye, instala pnpm antes de continuar.

```powershell
pnpm install --frozen-lockfile
```

### 2. Configurar el entorno

Si todavía no tienes `.env`, copia la plantilla:

```powershell
Copy-Item .env.example .env
```

Configuración local:

```dotenv
VITE_API_URL=/api
VITE_PROXY_TARGET=http://localhost:8080
```

| Variable            | Función                                                                    |
| ------------------- | -------------------------------------------------------------------------- |
| `VITE_API_URL`      | Prefijo usado por las peticiones del cliente y el inicio del flujo OAuth2. |
| `VITE_PROXY_TARGET` | Destino del proxy de Vite en desarrollo y vista previa.                    |

Con la configuración actual, conserva `VITE_API_URL=/api` para trabajar mediante el proxy. Reinicia Vite después de cambiar el entorno.

Las variables `VITE_*` pueden exponerse al navegador: no deben contener contraseñas, secretos JWT ni secretos de proveedores OAuth.

### 3. Iniciar backend y frontend

Arranca el backend en `http://localhost:8080` siguiendo su README. Después ejecuta:

```powershell
pnpm dev
```

Abre la URL indicada por Vite, normalmente `http://localhost:5173`. Si el puerto está ocupado y Vite elige otro, revisa también el origen permitido y `FRONTEND_URL` del backend, especialmente para OAuth2.

## Comandos disponibles

| Comando        | Función                                                 |
| -------------- | ------------------------------------------------------- |
| `pnpm dev`     | Iniciar Vite en desarrollo.                             |
| `pnpm build`   | Ejecutar TypeScript y generar la aplicación en `dist/`. |
| `pnpm lint`    | Analizar el código con Oxlint.                          |
| `pnpm preview` | Servir una vista previa del build generado.             |

Para comprobar el proyecto y visualizar el build:

```powershell
pnpm lint
pnpm build
pnpm preview
```

El proyecto no tiene un script `test` definido actualmente. La vista previa permite revisar el build localmente; el despliegue incluido utiliza Nginx.

## Integración con el backend

```text
Navegador → localhost:5173/api/* → proxy de Vite → localhost:8080/*
```

Vite elimina el prefijo `/api`: una llamada a `/api/auth/login` llega a Spring Boot como `/auth/login`.

El cliente HTTP está en [src/lib/api.ts](src/lib/api.ts). Añade el token Bearer, permite formularios multipart y normaliza errores de la API. Las operaciones de autenticación y perfil están en [src/lib/auth.ts](src/lib/auth.ts).

| Método | Ruta del backend        | Uso                                            |
| ------ | ----------------------- | ---------------------------------------------- |
| POST   | `/auth/login`           | Iniciar sesión.                                |
| POST   | `/auth/register`        | Registrar una cuenta de jugador.               |
| GET    | `/auth/me`              | Consultar el perfil.                           |
| PUT    | `/auth/me`              | Actualizar nombre de usuario y correo.         |
| PUT    | `/auth/me/contrasena`   | Cambiar la contraseña.                         |
| PUT    | `/usuarios/{id}/imagen` | Subir avatar con el campo multipart `archivo`. |
| GET    | `/usuarios/{id}/imagen` | Mostrar el avatar.                             |

## Sesión y rutas

La sesión se guarda en `localStorage` con la clave `fg:session`; la lectura también contempla `sessionStorage`. El frontend lee la expiración del JWT, mientras que el backend verifica su firma y autoriza las operaciones.

| Ruta             | Vista / acceso                                        |
| ---------------- | ----------------------------------------------------- |
| `/`              | Landing pública.                                      |
| `/login`         | Inicio de sesión; redirige al panel si ya hay sesión. |
| `/auth/callback` | Retorno del acceso OAuth2.                            |
| `/admin`         | Dashboard de `ADMINISTRADOR`.                         |
| `/admin/*`       | Secciones administrativas, actualmente provisionales. |
| `/jugador`       | Dashboard de `JUGADOR`.                               |
| `/jugador/*`     | Secciones del jugador, actualmente provisionales.     |
| Otras rutas      | Página de recurso no encontrado.                      |

El enrutamiento se define en [src/App.tsx](src/App.tsx). Los controles del navegador no sustituyen los permisos del backend.

### OAuth2

El flujo se inicia en `{VITE_API_URL}/oauth2/authorization/google` o `{VITE_API_URL}/oauth2/authorization/discord`. El retorno al frontend se procesa en `/auth/callback`.

Configura las credenciales del proveedor en el backend y utiliza `FRONTEND_URL=http://localhost:5173` para el entorno local. Los callbacks registrados en Google o Discord deben coincidir con la URL externa que utiliza el backend, considerando el proxy si corresponde.

## Docker y Nginx

El [dockerfile](dockerfile) compila con Node y pnpm y sirve `dist/` mediante Nginx. El nombre del archivo está en minúsculas:

```powershell
docker build -f dockerfile -t footgamers-web .
docker run --name footgamers-web -p 8081:80 footgamers-web
```

Abre `http://localhost:8081`. Para que las llamadas a la API funcionen, configura la conectividad del backend antes de desplegar.

En [nginx.conf](nginx.conf), `/api/` se reenvía actualmente a:

```text
http://footgamers-backend-yxj9ea:8080
```

Ese nombre pertenece al despliegue actual. Adáptalo al nombre DNS de tu servicio backend y conecta ambos contenedores a una red compartida si corresponde. El resolver `127.0.0.11` de esa configuración corresponde al DNS interno de Docker.

Nginx elimina `/api` al reenviar las solicitudes y utiliza `index.html` como alternativa para las rutas de React Router. El proxy de Vite no forma parte de los archivos de producción: cambiar `VITE_PROXY_TARGET` no cambia el destino de Nginx.

Los valores del cliente se incorporan durante `pnpm build`. Cambiarlos después de construir la imagen no reconfigura el JavaScript ya generado; reconstruye cuando cambies esos valores.

## Estructura

```text
src/
├── assets/             # Imágenes y recursos
├── components/         # Componentes y layouts por rol
│   ├── admin/
│   ├── jugador/
│   └── panel/
├── context/            # Contexto y proveedor de autenticación
├── data/               # Contenido, navegación y datos de ejemplo
├── hooks/              # Hooks personalizados
├── lib/                # Cliente HTTP, sesión y autenticación
├── pages/              # Vistas públicas y paneles
├── App.tsx             # Rutas
├── index.css           # Estilos
└── main.tsx            # Punto de entrada
```

## Problemas frecuentes

| Síntoma                                 | Qué revisar                                                           |
| --------------------------------------- | --------------------------------------------------------------------- |
| No se puede conectar / error del proxy  | Backend activo y `VITE_PROXY_TARGET` correcto.                        |
| HTTP 401                                | Sesión vencida o token inválido; vuelve a iniciar sesión.             |
| Acceso denegado a un panel              | Rol de la cuenta y restricciones de la ruta.                          |
| Error al instalar o compilar            | Versión de Node compatible y dependencias instaladas con el lockfile. |
| Cambios en `.env` sin efecto            | Reiniciar Vite o reconstruir el build.                                |
| Error 502 en Docker                     | Destino de Nginx y conectividad entre servicios.                      |
| OAuth vuelve a una dirección incorrecta | `FRONTEND_URL`, callback del proveedor y URL externa del proxy.       |
| Métricas que no cambian                 | Los dashboards todavía utilizan datos de ejemplo.                     |

## Panel conectado al backend

- Jugador: torneos abiertos e inscripción, mis torneos, mis partidos, clasificación por grupos, trofeos y perfil.
- Administrador: CRUD de recursos, inscripción de jugadores, distribución de grupos (aleatoria, equilibrada o manual), generación de partidos y llaves, resultados, ganadores y campeón.
- Los formularios muestran errores del servidor y evitan envíos duplicados. La paginación admite el formato `content` + `page` de Spring Boot.
- El detalle consulta también `GET /torneos/{id}/participantes` y `GET /partidos/{id}/participaciones`; es necesario reiniciar el backend actualizado.

### Validación de integración

`tests/panel-api.mjs` recorre un torneo completo con cuentas sintéticas y verifica permisos de jugador. Ejecutarlo exclusivamente contra una instancia de pruebas en el puerto 8082 con un esquema PostgreSQL separado, nunca contra la base habitual. Configurar `SPRING_DATASOURCE_URL` con `currentSchema` y `SPRING_JPA_PROPERTIES_HIBERNATE_DEFAULT_SCHEMA` al esquema de pruebas antes de iniciar esa instancia. Con el administrador inicial disponible, ejecutar en PowerShell:

```powershell
$env:PANEL_TEST_BASE_URL='http://localhost:8082'
node tests/panel-api.mjs
```

La prueba crea datos sintéticos; eliminar únicamente su esquema aislado después de detener la instancia de pruebas.

### Portadas de administrador y jugador

La portada administrativa ofrece contadores reales, agenda de torneos, últimos partidos y creación de torneos mediante un formulario conectado a la API. La portada del jugador muestra su actividad y tarjetas de torneos abiertos con inscripción directa. Una inscripción actualiza los cupos, los contadores y la lista personal; el botón queda deshabilitado para evitar duplicados.

Los torneos abiertos tienen plazas disponibles y todavía no tienen grupos asignados. Los listados completos siguen disponibles desde cada tarjeta. La portada limita las vistas previas a cinco torneos/partidos y cuatro torneos abiertos; los contadores muestran los totales del servidor.

### Llaves de eliminación directa

El detalle del torneo incluye un bracket simétrico oscuro y dorado de hasta 16 clasificados. Los participantes, equipos, ganadores y conexiones provienen de `GET /torneos/{id}/bracket`; no hay equipos fijos ni resultados almacenados solo en el navegador. El administrador selecciona un equipo para guardar el ganador; los jugadores consultan el cuadro. Cambiar un ganador limpia únicamente sus rondas dependientes y revoca el campeón anterior. El cuadro conserva su ancho con desplazamiento horizontal en móvil.

Se usa la generación de llaves existente del backend: pasan dos jugadores por grupo. Para obtener 16 clasificados, configurar ocho grupos con al menos dos jugadores cada uno y generar las llaves desde el detalle. Elegir un ganador no inventa un marcador; este se puede registrar desde el detalle del partido.

`tests/bracket-api.mjs` verifica un cuadro completo, permisos, cambio de ganador y limpieza de dependencias. Ejecutar solo con el esquema de pruebas aislado y `PANEL_TEST_BASE_URL=http://localhost:8082`, igual que la prueba de integración del panel.
