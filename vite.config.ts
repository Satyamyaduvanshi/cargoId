import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      process: resolve(__dirname, 'node_modules/process/browser.js'),
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
      buffer: resolve(__dirname, 'node_modules/buffer/index.js'),
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    include: ['buffer', 'process', 'stream-browserify', 'browserify-zlib', 'util']
  },
  build: {
    rollupOptions: {
      external: ['fsevents'],
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
