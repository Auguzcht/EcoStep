import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Check if we're in production (Vercel deployment)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,js}",
      jsxImportSource: 'react',
    })
  ],
  // Use different base paths for development vs production
  base: isProduction ? '/' : '/EcoStep/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    assetsInlineLimit: 4096,
  },
  // Add environment variable configuration
  define: {
    'import.meta.env.VITE_APP_THINGSPEAK_CHANNEL_ID': 
      JSON.stringify(process.env.REACT_APP_THINGSPEAK_CHANNEL_ID || "2995641"),
    'import.meta.env.VITE_APP_THINGSPEAK_READ_API_KEY': 
      JSON.stringify(process.env.REACT_APP_THINGSPEAK_READ_API_KEY || "JAEGUGJX3K7ICOHQ"),
    'import.meta.env.VITE_BASE_PATH': JSON.stringify(isProduction ? '/' : '/EcoStep/')
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif', '**/*.webp'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@public': path.resolve(__dirname, './public')
    }
  }
})