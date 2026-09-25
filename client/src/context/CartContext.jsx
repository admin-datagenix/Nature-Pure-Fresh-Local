import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api/client';
import {
  buildSubsetCart,
  loadStoredSelection,
  saveStoredSelection,
  syncSelectionWithCart,
} from '../utils/cartSelection';
import { notifyError, notifySuccess } from '../utils/notify';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, itemCount: 0 });
  const [selectedIds, setSelectedIds] = useState(() => loadStoredSelection());
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const res = await api.getCart();
      const data = res.data;
      setCart(data);
      setSelectedIds((prev) => {
        const next = syncSelectionWithCart(data.items, prev);
        saveStoredSelection(next);
        return next;
      });
    } catch {
      /* cart unavailable offline */
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    saveStoredSelection(selectedIds);
  }, [selectedIds]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedCart = useMemo(
    () => buildSubsetCart(cart, selectedIds),
    [cart, selectedIds]
  );

  const isSelected = useCallback((productId) => selectedSet.has(productId), [selectedSet]);

  const toggleSelect = useCallback((productId) => {
    setSelectedIds((prev) => {
      const set = new Set(prev);
      if (set.has(productId)) set.delete(productId);
      else set.add(productId);
      return [...set];
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(cart.items.map((i) => i.product_id));
  }, [cart.items]);

  const selectNone = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const addItem = useCallback(async (productId, quantity = 1, options = {}) => {
    setLoading(true);
    try {
      const res = await api.addToCart(productId, quantity, options);
      setCart(res.data);
      setSelectedIds((prev) => {
        if (prev.includes(productId)) return prev;
        const next = [...prev, productId];
        saveStoredSelection(next);
        return next;
      });
      const line = res.data.items.find((i) => i.product_id === productId);
      const label = line?.name?.replace(/^Freeze Dried /i, '') || 'Item';
      notifySuccess(
        quantity > 1 ? `Added ${quantity} × ${label} to cart` : `Added ${label} to cart`
      );
      return res.data;
    } catch (err) {
      notifyError(err.message || 'Could not add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (productId, quantity) => {
    setLoading(true);
    try {
      const prevLine = cart.items.find((i) => i.product_id === productId);
      const res = await api.updateCartItem(productId, quantity);
      setCart(res.data);
      if (quantity <= 0) {
        setSelectedIds((prev) => prev.filter((id) => id !== productId));
        const label = prevLine?.name?.replace(/^Freeze Dried /i, '') || 'Item';
        notifyInfo(`Removed ${label} from cart`);
      }
    } catch (err) {
      notifyError(err.message || 'Could not update cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart.items]);

  const clear = useCallback(async () => {
    try {
      const res = await api.clearCart();
      setCart(res.data);
      setSelectedIds([]);
      notifyInfo('Cart cleared');
    } catch (err) {
      notifyError(err.message || 'Could not clear cart');
      throw err;
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        selectedCart,
        selectedIds,
        selectedCount: selectedCart.itemCount,
        isSelected,
        toggleSelect,
        selectAll,
        selectNone,
        loading,
        addItem,
        updateItem,
        clear,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
