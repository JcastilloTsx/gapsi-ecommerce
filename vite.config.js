import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/icon.png'],
      manifest: {
        name: 'e-Commerce Gapsi',
        short_name: 'Gapsi',
        description: 'Buscador y carrito de compras de e-Commerce Gapsi',
        theme_color: '#1269d3',
        background_color: '#f5f6f8',
        display: 'standalone',
        start_url: '/',
        icons: [{ src: '/assets/icon.png', sizes: '32x32', type: 'image/png' }],
      },
    }),
    // Ofuscación real (más allá del minificado de esbuild/terser), solo en build de producción.
    obfuscatorPlugin({
      apply: 'build',
      options: {
        compact: true,
        controlFlowFlattening: false,
        stringArray: true,
        stringArrayThreshold: 0.75,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,
      },
    }),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
      mangle: true,
    },
  },
})
