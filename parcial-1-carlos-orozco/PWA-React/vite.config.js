import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MediClinic - Pacientes',
        short_name: 'MediClinic',
        description: 'Administración de pacientes - MediClinic',
        theme_color: '#2dd36f',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          // TODO: agregar icon-192.png e icon-512.png en /public y descomentar
          // { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          // { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
