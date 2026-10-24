import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// allowedHosts permite abrir la app en el celular por un túnel de Cloudflare
// (cloudflared tunnel --url http://localhost:5173 → https://xxxx.trycloudflare.com).
// La cámara, el GPS y el acelerómetro del navegador solo funcionan en HTTPS (o localhost).
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
})
