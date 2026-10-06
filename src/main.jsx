import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CreditProvider } from './context/CreditContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CreditProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '12px' },
                  success: { style: { background: '#F7E7CE', color: '#242019', border: '1px solid #E8C37F' } },
                  error: { style: { background: '#F5C6D0', color: '#5C0018', border: '1px solid #E88A9A' } },
                }}
              />
            </CreditProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
