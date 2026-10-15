import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { registerServiceWorker } from './pwa/useOffline';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

/**
 * HashRouter rather than BrowserRouter: this has to deploy unchanged to
 * GitHub Pages, a shared host or a USB stick without server rewrite rules.
 * Deep links and shared scenario URLs work everywhere.
 */
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);

/**
 * Offline support, registered after render so it never delays first paint.
 *
 * The worker reports an available update by way of a window event rather
 * than a callback into React, which keeps the registration side free of any
 * dependency on the component tree: if the app crashes, the worker is still
 * registered and the next visit still works offline.
 */
registerServiceWorker(() => {
  window.dispatchEvent(new Event('gm26:update-ready'));
});
