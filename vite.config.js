import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Check if we're in production (Vercel deployment)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use different base paths for development vs production
  base: isProduction ? '/' : '/EcoStep/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        },
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  // Add environment variable configuration
  define: {
    'import.meta.env.VITE_APP_THINGSPEAK_CHANNEL_ID': 
      JSON.stringify(process.env.REACT_APP_THINGSPEAK_CHANNEL_ID || "2995641"),
    'import.meta.env.VITE_APP_THINGSPEAK_READ_API_KEY': 
      JSON.stringify(process.env.REACT_APP_THINGSPEAK_READ_API_KEY || "JAEGUGJX3K7ICOHQ"),
    // Add a variable to check if we're in production in the app code
    'import.meta.env.VITE_IS_PRODUCTION': isProduction
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif', '**/*.webp'],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets'
    }
  }
})