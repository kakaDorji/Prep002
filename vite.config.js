import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    }
  },

  server: {
    allowedHosts: ['prep001.onrender.com'],  // <--- ADD THIS LINE

    proxy: {
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        secure: false,

        rewrite: (path) =>
          path.replace(
            /^\/api/,
            '/macros/s/AKfycbwxlHTi5mvm1SbcPXGfkuadV4rdEaq6S9u7ZV7_EhcNHjeC4dx1_zp2INJ6mBdGlP5-xg/exec'
          ),

        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['content-type'] = 'application/json';
          });
        },

        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Forwarded-Proto': 'https'
        }
      }
    },

    host: true,
    port: 5173,
    strictPort: true,
    open: true,
  },

  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
         external: ['google-apps-script'],
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          vendor: ['axios', 'lodash']
          
        },
       
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },

  css: {
    postcss: './postcss.config.js',
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@assets/styles/variables.scss";`
      }
    }
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios'
    ],
    exclude: ['google-apps-script']
  }
});

