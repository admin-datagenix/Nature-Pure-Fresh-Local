import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const res = await api.getCart();
      setCart(res.data);
    } catch {
      /* cart unavailable offline */
    }
  }, []);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const res = await api.addToCart(productId, quantity);
      setCart(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (productId, quantity) => {
    setLoading(true);
    try {
      const res = await api.updateCartItem(productId, quantity);
      setCart(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(async () => {
    const res = await api.clearCart();
    setCart(res.data);
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, clear, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
