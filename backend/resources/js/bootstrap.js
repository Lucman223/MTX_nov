import axios from 'axios';
window.axios = axios;

// Set config for production
window.axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://mtxnov-production.up.railway.app';
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

if (import.meta.env.VITE_PUSHER_APP_KEY) {
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        wsHost: import.meta.env.VITE_PUSHER_HOST ?? 'mtxnov-production.up.railway.app',
        wsPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
        wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
        wssPort: 8080,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
    });
} else {
    console.warn('Pusher key not found. Echo not initialized.');
}
