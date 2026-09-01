import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/drive_ease-car_management_system/',
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
})
