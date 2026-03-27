import React from 'react';
import ReactDOM from 'react-dom/client';
import { BaseStyles, ThemeProvider } from '@primer/react';
import { App } from './App';
import { ButtonShowcasePage } from './ButtonShowcasePage';
import './styles.css';

const isButtonShowcase = window.location.pathname === '/button-showcase';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BaseStyles>
        {isButtonShowcase ? <ButtonShowcasePage /> : <App />}
      </BaseStyles>
    </ThemeProvider>
  </React.StrictMode>,
);
