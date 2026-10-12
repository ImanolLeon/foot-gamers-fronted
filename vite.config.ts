import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  // Ruta pública del frontend que hace de proxy hacia el backend.
  const apiPrefix = env.VITE_API_URL || '/api'
  const apiTarget = env.VITE_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss()
    ],
    server: {
      proxy: {
        // El backend tiene `.cors().disable()` en SecurityConfig, asi que el
        // navegador no puede llamarlo directo desde otro puerto: el proxy lo
        // resuelve desde el mismo origen y nunca dispara un preflight CORS.
        [apiPrefix]: {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${apiPrefix}`), '')
        }
      }
    },
    preview: {
      proxy: {
        [apiPrefix]: {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${apiPrefix}`), '')
        }
      }
    }
  }
})