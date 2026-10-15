import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const BACKEND_PORT = Number(env.VITE_BACKEND_PORT || process.env.VITE_BACKEND_PORT || env.BACKEND_PORT || process.env.BACKEND_PORT || 8080)
  const FRONTEND_PORT = Number(env.VITE_PORT || process.env.VITE_PORT || env.PORT || process.env.PORT || 5173)

  return {
    plugins: [react()],
    server: {
      port: FRONTEND_PORT,
      proxy: {
        '/api': {
          target: `http://localhost:${BACKEND_PORT}`,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'react-vendor': ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  }
})
