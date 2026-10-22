import { STORE_SETTINGS } from '../config/storeSettings.js';

export function isOutOfStockUiEnabled() {
  return STORE_SETTINGS.showOutOfStockUi !== false;
}

export function isOutOfStock(product) {
  if (!isOutOfStockUiEnabled()) return false;
  return (product?.stock ?? 0) <= 0;
}

export function getLowStockThreshold() {
  return STORE_SETTINGS.lowStockThreshold ?? 5;
}

/** In stock but at or below low-stock threshold (e.g. ≤5 units). */
export function isLowStock(product) {
  const qty = product?.stock ?? 0;
  return qty > 0 && qty <= getLowStockThreshold();
}

export function lowStockLabel(product) {
  const qty = product?.stock ?? 0;
  if (!isLowStock(product)) return null;
  return qty === 1 ? 'Only 1 left' : `Only ${qty} left`;
}

/** Fewest units first; cap for shop strip. */
export function pickLowStockProducts(products, limit = STORE_SETTINGS.lowStockShopDisplayCount ?? 3) {
  if (!Array.isArray(products) || limit <= 0) return [];
  return products
    .filter((p) => isLowStock(p))
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    .slice(0, limit);
}

export function shouldShowLowStockBadge(product) {
  if (STORE_SETTINGS.showLowStockBadges === false) return false;
  return isLowStock(product) && !isOutOfStock(product);
}

export function getOutOfStockMode() {
  return STORE_SETTINGS.outOfStockDisplay;
}

/** Apply admin out-of-stock rule to a product list (unless user explicitly filters out-of-stock). */
export function applyOutOfStockListingFilter(products, stockFilter) {
  if (getOutOfStockMode() !== 'hidden' || stockFilter === 'out') {
    return products;
  }
  return products.filter((p) => !isOutOfStock(p));
}

export function shouldShowOutOfStockBadge(product) {
  if (!isOutOfStock(product)) return false;
  const mode = getOutOfStockMode();
  return mode === 'badge' || mode === 'greyed';
}

export function outOfStockCardClass(product) {
  if (!isOutOfStock(product) || getOutOfStockMode() !== 'greyed') return '';
  return 'opacity-75';
}
