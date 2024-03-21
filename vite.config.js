import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseConfig = {
    base: '/wordymap/',
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat'
      }
    },
    plugins: [react(), VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['vite.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 3 * 1000000
      },
      manifest: {
        name: 'Wordy',
        short_name: 'Wordy',
        description: 'A word game',
        theme_color: '#1a1a1a',
        icons: [
          {
            src: 'pwa192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: "any"
          },
          {
            src: 'pwa512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: "maskable"
          }
        ]
      }
    })]
  }
  if (mode !== 'development') {
    baseConfig.esbuild = {
      drop: ['console', 'debugger']
    }
  }
  return baseConfig
})