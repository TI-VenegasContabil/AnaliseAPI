import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

  server: {
    host: true,       // Permite que o servidor use o endereço IP local automaticamente
    port: 5173,       // Escolha a porta desejada
    strictPort: true, // Garante que sempre use a porta especificada
  },
  plugins: [react()],
})
