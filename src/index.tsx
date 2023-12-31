import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Type assertion to tell TypeScript that createRoot exists
const root = (ReactDOM as any).createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);