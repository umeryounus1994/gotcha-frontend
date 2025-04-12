import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    port: parseInt(process.env.PORT) || 4173, // 🔑 Use DO's dynamic port
    host: '0.0.0.0', // 🔑 Required so external traffic can reach the app
  }
})
