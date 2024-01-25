import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/wordymap/',
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate', devOptions: { enabled: true },
    includeAssets: ['vite.svg'],
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
})
