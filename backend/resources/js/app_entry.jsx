import React from 'react';
import './bootstrap'; // <--- LOAD FIRST: Configures axios & globals
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './i18n';
import { registerSW } from 'virtual:pwa-register';

// PWA Registration
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);