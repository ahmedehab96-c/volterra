import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // <model-viewer> (~1 MB) is lazy-loaded only for vehicles that have a 3D model
    chunkSizeWarningLimit: 1100,
  },
})
