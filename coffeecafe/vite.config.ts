import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Туннель Tuna (*.ru.tuna.am и др.) — иначе Vite отвечает 403 «host is not allowed»
    allowedHosts: ['.tuna.am'],
  },
})
