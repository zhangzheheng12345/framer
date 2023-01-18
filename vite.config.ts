import { defineConfig } from 'vite'

const path = require('path')

export default defineConfig({
  server: {
    host: '0.0.0.0',
    hmr: {
      port: 443
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
