import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

/**
 * Application entry point. Mounts the React app to the #root element.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure index.html contains a <div id="root">.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
