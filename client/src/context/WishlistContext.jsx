import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadWishlistIds, saveWishlistIds } from '../utils/wishlistStorage';
import { notifySuccess } from '../utils/notify';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => loadWishlistIds());

  useEffect(() => {
    saveWishlistIds(ids);
  }, [ids]);

  const idSet = useMemo(() => new Set(ids), [ids]);

  const isWishlisted = useCallback((productId) => idSet.has(productId), [idSet]);

  const add = useCallback((productId, label) => {
    if (!productId) return;
    setIds((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
    notifySuccess(label ? `${label} saved to wishlist` : 'Added to wishlist');
  }, []);

  const remove = useCallback((productId, label) => {
    if (!productId) return;
    setIds((prev) => prev.filter((id) => id !== productId));
    if (label) notifySuccess(`${label} removed from wishlist`);
  }, []);

  const toggle = useCallback(
    (productId, label) => {
      if (!productId) return;
      if (idSet.has(productId)) {
        remove(productId, label);
      } else {
        add(productId, label);
      }
    },
    [add, remove, idSet]
  );

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      isWishlisted,
      add,
      remove,
      toggle,
      clear,
    }),
    [ids, isWishlisted, add, remove, toggle, clear]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
