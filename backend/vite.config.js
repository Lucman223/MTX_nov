import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app_entry.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: false // Disabled to prevent caching issues in dev tunnel
            },
            manifest: {
                name: 'MotoTX - Plataforma de Mototaxi',
                short_name: 'MotoTX',
                description: 'Gestión profesional de servicios de mototaxi',
                theme_color: '#2563eb',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                navigateFallbackDenylist: [/^\/api/],
                runtimeCaching: [{
                    urlPattern: ({ url }) => url.pathname.startsWith('/api'),
                    handler: 'NetworkOnly',
                    options: {
                        cacheName: 'api-cache',
                        backgroundSync: {
                            name: 'api-queue',
                            options: {
                                maxRetentionTime: 24 * 60
                            }
                        }
                    }
                }]
            }
        })
    ],
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
            },
            '/sanctum': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
