import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '..', '')
  const apiUrl = env.VITE_API_URL || 'https://api-w2w.eepis.web.id/api/v1'

  return {
    envDir: '..',
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      proxy: {
        '/api': {
          target: new URL(apiUrl).origin,
          changeOrigin: true,
          secure: true
        }
      }
    },
  }
})
