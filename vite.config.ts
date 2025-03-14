import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  // Specify a consistent port
  server: {
    port: 5174,
    strictPort: true // This will fail if the port is not available instead of trying another one
  },
  // Use the existing renderer directory as the root
  root: resolve(__dirname, 'src/renderer'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/renderer/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  // Handle video file formats properly
  assetsInclude: ['**/*.MOV', '**/*.mov', '**/*.mp4', '**/*.svg', '**/*.png'],
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material']
  },
})