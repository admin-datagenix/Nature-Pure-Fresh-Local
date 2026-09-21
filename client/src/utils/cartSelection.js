const SELECTION_KEY = 'fresh_nature_cart_selection';

export function loadStoredSelection() {
  try {
    const raw = sessionStorage.getItem(SELECTION_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredSelection(productIds) {
  sessionStorage.setItem(SELECTION_KEY, JSON.stringify(productIds));
}

/** Cart summary for a subset of line items by product_id */
export function buildSubsetCart(cart, productIds) {
  if (!cart?.items?.length) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }
  if (!productIds?.length) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }
  const set = new Set(productIds);
  const items = cart.items.filter((i) => set.has(i.product_id));
  const subtotal = items.reduce((sum, i) => sum + i.line_total, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, subtotal, itemCount };
}

export function syncSelectionWithCart(cartItems, previousSelection) {
  const idsInCart = cartItems.map((i) => i.product_id);
  const prevSet = new Set(previousSelection);
  const kept = idsInCart.filter((id) => prevSet.has(id));
  const added = idsInCart.filter((id) => !prevSet.has(id));
  return [...kept, ...added];
}
