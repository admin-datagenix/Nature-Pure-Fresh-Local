import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import AppToastContainer from './components/ui/AppToastContainer';
import WhatsAppFab from './components/layout/WhatsAppFab';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <AppToastContainer />
          <WhatsAppFab />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
