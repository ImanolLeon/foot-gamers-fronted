import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type ProxyOptions } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // Ruta pública del frontend que hace de proxy hacia el backend.
  const apiPrefix = env.VITE_API_URL || '/api';
  const apiTarget = env.VITE_PROXY_TARGET || 'http://localhost:8080';
  const apiProxy: ProxyOptions = {
    target: apiTarget,
    changeOrigin: true,
    rewrite: (path) => path.slice(apiPrefix.length),
    proxyTimeout: 15000,
    configure(proxy) {
      proxy.on('error', (_error, _request, response) => {
        // También se emite para WebSocket, cuya respuesta es un socket.
        if (
          !('writeHead' in response) ||
          response.headersSent ||
          response.writableEnded
        )
          return;
        response.writeHead(503, {
          'Content-Type': 'application/problem+json; charset=utf-8',
        });
        response.end(
          JSON.stringify({
            status: 503,
            title: 'Backend no disponible',
            detail:
              'No se pudo conectar con Spring Boot. Inicia el backend en el puerto configurado en VITE_PROXY_TARGET y pulsa Actualizar.',
          }),
        );
      });
    },
  };

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        // El proxy elimina /api; Spring valida el Origin del navegador mediante CORS.
        [apiPrefix]: apiProxy,
      },
    },
    preview: {
      port: 4173,
      strictPort: true,
      proxy: {
        [apiPrefix]: apiProxy,
      },
    },
  };
});
