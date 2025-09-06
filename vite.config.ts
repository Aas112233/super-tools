import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'framer-motion'],
          charts: ['echarts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      port: 5174,
      clientPort: 5174,
      overlay: false, // Disable error overlay to prevent WebSocket issues
    },
    // Add WebSocket configuration
    ws: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  // Optimize dependencies to reduce HMR issues
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@tensorflow/tfjs'],
  },
})