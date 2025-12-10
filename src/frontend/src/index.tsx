import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './styles/theme.css';
import App from './App';
import { store } from './store/store';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastContainer from './components/ToastContainer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

