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
      port: 5173,
      strictPort: true,
      proxy: {
        // El proxy elimina /api; Spring valida el Origin del navegador mediante CORS.
        [apiPrefix]: {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${apiPrefix}`), '')
        }
      }
    },
    preview: {
      port: 4173,
      strictPort: true,
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