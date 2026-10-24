import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

// `npm run phone` levanta el servidor con HTTPS en la red local.
// iOS/Android solo habilitan GPS, cámara y movimiento en páginas seguras (HTTPS).
// allowedHosts permite abrir la app por un túnel de Cloudflare (https://xxxx.trycloudflare.com).
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'phone' ? [basicSsl()] : [])],
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
}))
