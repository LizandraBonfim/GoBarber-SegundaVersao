import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './styles';
import Router from './routes';

import AppProvider from './context/index';

function App() {
  return (
    <BrowserRouter >

      <AppProvider>
        <Router />
      </AppProvider>

      <GlobalStyles />

    </BrowserRouter>
  );
}

export default App;
