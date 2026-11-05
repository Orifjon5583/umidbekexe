import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// PWA Service Worker ro'yxatdan o'tkazish
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
