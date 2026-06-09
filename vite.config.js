import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
registerType: 'autoUpdate',
manifest: {
name: 'CosmoGarden App',
short_name: 'MiPWA',
description: 'Aplicación Web Progresiva con React y Vite',
theme_color: '#ffffff',
background_color: '#ffffff',
display: 'standalone',
start_url: '/',
icons: [
{
src: 'icon-192.jpeg',
sizes: '192x192',
type: 'image/jpeg'
},
{
src: 'icoon-512.jpeg',
sizes: '512x512',
type: 'image/jpeg'
}
]
}
})
  ],base:'/'
})