import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, optional: use same origin for API (e.g. fetch('/api/...')) and set VITE_API_URL to ''
      // Or keep VITE_API_URL=http://localhost:3001 and the app will call the backend directly.
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})
