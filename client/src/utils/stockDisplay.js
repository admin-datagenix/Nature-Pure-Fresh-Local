import { STORE_SETTINGS } from '../config/storeSettings.js';

export function isOutOfStock(product) {
  return (product?.stock ?? 0) <= 0;
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
