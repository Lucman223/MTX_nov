import axios from 'axios';
window.axios = axios;

// Set config for production - use relative paths or environment variable
window.axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

if (import.meta.env.VITE_PUSHER_APP_KEY) {
    const scheme = import.meta.env.VITE_PUSHER_SCHEME ?? 'https';
    const host = import.meta.env.VITE_PUSHER_HOST;

    // [ES] Evitar ERR_NAME_NOT_RESOLVED: Si el host es localhost o vacío y estamos en producción, usar el hostname actual
    const finalHost = (host && host !== 'localhost' && host !== '127.0.0.1')
        ? host
        : window.location.hostname;

    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        wsHost: finalHost,
        wsPort: import.meta.env.VITE_PUSHER_PORT ?? (scheme === 'https' ? 443 : 80),
        wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
        forceTLS: scheme === 'https',
        enabledTransports: ['ws', 'wss'],
    });
}
