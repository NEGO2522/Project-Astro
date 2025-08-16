import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      'process.env': env
    },
    plugins: [react(), tailwindcss()],
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'unsafe-none',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        // Add any API proxy configurations here if needed
        '/api': {
          target: 'http://localhost:5173', // Adjust this to your API URL
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      target: 'esnext', // Ensures modern JavaScript features are available
      rollupOptions: {
        output: {
          manualChunks: {
            // Add any manual chunks if needed for code splitting
          }
        }
      }
    }
  }
})
