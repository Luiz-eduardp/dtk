import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppThemeProvider } from '@theme/theme';
import './global.css';

/**
 * Inicializa a aplicação React
 * Aplica o tema com glassmorphism e renderiza o App principal
 */

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>
);
