import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { App } from './App';
import './index.css';

// Auto-recover if browser tries to load a stale/purged asset chunk from an earlier deployment
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const storageKey = 'vite_chunk_reload_ts';
  const lastReload = parseInt(sessionStorage.getItem(storageKey) || '0', 10);
  const now = Date.now();
  if (now - lastReload > 10000) {
    sessionStorage.setItem(storageKey, now.toString());
    window.location.reload();
  }
});

window.addEventListener(
  'error',
  (event) => {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === 'LINK' || target.tagName === 'SCRIPT')) {
      const src = (target as any).href || (target as any).src || '';
      if (src.includes('/assets/')) {
        const storageKey = 'vite_asset_reload_ts';
        const lastReload = parseInt(sessionStorage.getItem(storageKey) || '0', 10);
        const now = Date.now();
        if (now - lastReload > 10000) {
          sessionStorage.setItem(storageKey, now.toString());
          window.location.reload();
        }
      }
    }
  },
  true
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <CustomerAuthProvider>
          <App />
        </CustomerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
