import ReactDOM from 'react-dom/client';
import App from './App';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './rtk/store';
import { Toaster } from 'react-hot-toast';

const root = (ReactDOM as any).createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={ store }>
      <Toaster />
      <App />
    </Provider>
  // </React.StrictMode>
);