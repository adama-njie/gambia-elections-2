import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
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
